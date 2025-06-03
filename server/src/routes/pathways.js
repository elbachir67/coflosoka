import express from "express";
import { Pathway } from "../models/Pathway.js";
import { Goal } from "../models/LearningGoal.js";
import { auth } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";
import PathwayGenerationService from "../services/PathwayGenerationService.js";

const router = express.Router();

// Generate new pathway
router.post("/generate", auth, async (req, res) => {
  try {
    const { goalId } = req.body;
    const userId = req.user.id;

    // Check if goal exists
    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ error: "Objectif non trouvé" });
    }

    // Check if pathway already exists for this user and goal
    const existingPathway = await Pathway.findOne({
      userId,
      goalId,
      status: { $ne: "completed" },
    });

    if (existingPathway) {
      return res
        .status(400)
        .json({ error: "Un parcours existe déjà pour cet objectif" });
    }

    // Generate pathway data using the service
    const pathwayData = await PathwayGenerationService.generatePathway(
      userId,
      goalId
    );

    // Create new pathway document
    const pathway = new Pathway(pathwayData);
    await pathway.save();

    // Populate the goal details
    await pathway.populate("goalId");

    res.json(pathway);
  } catch (error) {
    logger.error("Error generating pathway:", error);
    res.status(500).json({ error: "Erreur lors de la génération du parcours" });
  }
});

// Get specific pathway
router.get("/:pathwayId", auth, async (req, res) => {
  try {
    const { pathwayId } = req.params;
    const userId = req.user.id;

    // Find pathway and populate goal details
    const pathway = await Pathway.findOne({
      _id: pathwayId,
      userId,
    }).populate("goalId");

    if (!pathway) {
      return res.status(404).json({ error: "Parcours non trouvé" });
    }

    // Ensure adaptiveRecommendations is always an array
    const pathwayData = {
      ...pathway.toObject(),
      adaptiveRecommendations: pathway.adaptiveRecommendations || [],
    };

    res.json(pathwayData);
  } catch (error) {
    logger.error("Error fetching pathway:", error);
    res.status(500).json({ error: "Erreur lors du chargement du parcours" });
  }
});

// Update recommendation status
router.put("/:pathwayId/recommendations/:index", auth, async (req, res) => {
  try {
    const { pathwayId, index } = req.params;
    const { action } = req.body;
    const userId = req.user.id;

    // Validate action
    if (!["start", "skip", "complete"].includes(action)) {
      return res.status(400).json({ error: "Action invalide" });
    }

    // Find pathway
    const pathway = await Pathway.findOne({ _id: pathwayId, userId });
    if (!pathway) {
      return res.status(404).json({ error: "Parcours non trouvé" });
    }

    // Update recommendation status
    if (!pathway.adaptiveRecommendations?.[index]) {
      return res.status(404).json({ error: "Recommandation non trouvée" });
    }

    pathway.adaptiveRecommendations[index].status =
      action === "start"
        ? "pending"
        : action === "skip"
        ? "skipped"
        : "completed";

    await pathway.save();
    await pathway.populate("goalId");

    res.json(pathway);
  } catch (error) {
    logger.error("Error updating recommendation:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la recommandation" });
  }
});

// Get user's pathways
router.get("/user/dashboard", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [activePathways, completedPathways] = await Promise.all([
      Pathway.find({
        userId,
        status: { $in: ["active", "paused"] },
      }).populate("goalId"),
      Pathway.find({
        userId,
        status: "completed",
      }).populate("goalId"),
    ]);

    // Calculate learning stats
    const learningStats = {
      totalHoursSpent: 0,
      completedResources: 0,
      averageQuizScore: 0,
      streakDays: 0,
    };

    let totalQuizzes = 0;
    let quizScoreSum = 0;

    [...activePathways, ...completedPathways].forEach(pathway => {
      // Calculate total time spent
      const startDate = new Date(pathway.startedAt);
      const lastDate = new Date(pathway.lastAccessedAt);
      const hoursSpent = Math.round(
        (lastDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
      );
      learningStats.totalHoursSpent += hoursSpent;

      // Count completed resources and calculate quiz scores
      pathway.moduleProgress.forEach(module => {
        learningStats.completedResources += module.resources.filter(
          r => r.completed
        ).length;

        if (module.quiz.completed && module.quiz.score) {
          quizScoreSum += module.quiz.score;
          totalQuizzes++;
        }
      });
    });

    // Calculate average quiz score
    learningStats.averageQuizScore =
      totalQuizzes > 0 ? Math.round(quizScoreSum / totalQuizzes) : 0;

    // Calculate streak days
    learningStats.streakDays = calculateStreakDays([
      ...activePathways,
      ...completedPathways,
    ]);

    // Get next milestones
    const nextMilestones = activePathways.map(pathway => {
      const currentModule = pathway.moduleProgress[pathway.currentModule];
      const estimatedCompletion = new Date(pathway.estimatedCompletionDate);

      return {
        goalTitle: pathway.goalId.title,
        moduleName: pathway.goalId.modules[pathway.currentModule].title,
        dueDate: estimatedCompletion,
      };
    });

    res.json({
      learningStats,
      activePathways,
      completedPathways,
      nextMilestones,
    });
  } catch (error) {
    logger.error("Error fetching dashboard:", error);
    res
      .status(500)
      .json({ error: "Erreur lors du chargement du tableau de bord" });
  }
});

// Helper function to calculate streak days
function calculateStreakDays(pathways) {
  const activityDates = new Set();

  pathways.forEach(pathway => {
    pathway.moduleProgress.forEach(module => {
      module.resources.forEach(resource => {
        if (resource.completedAt) {
          activityDates.add(resource.completedAt.toISOString().split("T")[0]);
        }
      });
      if (module.quiz.completedAt) {
        activityDates.add(module.quiz.completedAt.toISOString().split("T")[0]);
      }
    });
  });

  let streak = 0;
  let currentDate = new Date();

  while (activityDates.has(currentDate.toISOString().split("T")[0])) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

export const pathwayRoutes = router;
