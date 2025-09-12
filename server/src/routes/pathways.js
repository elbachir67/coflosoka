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

// Update module progress
router.put("/:pathwayId/modules/:moduleIndex", auth, async (req, res) => {
  try {
    const { pathwayId, moduleIndex } = req.params;
    const { resourceId, completed } = req.body;
    const userId = req.user.id;

    const pathway = await Pathway.findOne({ _id: pathwayId, userId });
    if (!pathway) {
      return res.status(404).json({ error: "Parcours non trouvé" });
    }

    const moduleIdx = parseInt(moduleIndex);
    if (isNaN(moduleIdx) || moduleIdx >= pathway.moduleProgress.length) {
      return res.status(400).json({ error: "Index de module invalide" });
    }

    // Update resource completion status
    const resourceIndex = pathway.moduleProgress[moduleIdx].resources.findIndex(
      r => r.resourceId === resourceId
    );

    if (resourceIndex === -1) {
      return res.status(404).json({ error: "Ressource non trouvée" });
    }

    pathway.moduleProgress[moduleIdx].resources[resourceIndex].completed =
      completed;
    pathway.moduleProgress[moduleIdx].resources[resourceIndex].completedAt =
      new Date();

    // Check if all resources are completed
    const allResourcesCompleted = pathway.moduleProgress[
      moduleIdx
    ].resources.every(r => r.completed);

    // If all resources are completed and quiz is completed, mark module as completed
    if (
      allResourcesCompleted &&
      pathway.moduleProgress[moduleIdx].quiz.completed &&
      pathway.moduleProgress[moduleIdx].quiz.score >= 70
    ) {
      pathway.moduleProgress[moduleIdx].completed = true;

      // Unlock next module if available
      if (moduleIdx < pathway.moduleProgress.length - 1) {
        pathway.moduleProgress[moduleIdx + 1].locked = false;
        pathway.currentModule = moduleIdx + 1;
      }
    }

    // Update overall progress
    const completedModules = pathway.moduleProgress.filter(
      m => m.completed
    ).length;
    pathway.progress = Math.round(
      (completedModules / pathway.moduleProgress.length) * 100
    );

    // Update last accessed timestamp
    pathway.lastAccessedAt = new Date();

    await pathway.save();
    await pathway.populate("goalId");

    res.json(pathway);
  } catch (error) {
    logger.error("Error updating module progress:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du module" });
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
    let totalResourcesCompleted = 0;
    let totalSessionTime = 0;

    [...activePathways, ...completedPathways].forEach(pathway => {
      // Calculate realistic time spent based on completed resources
      let pathwayHours = 0;

      // Count completed resources and calculate quiz scores
      pathway.moduleProgress.forEach(module => {
        const completedResources = module.resources.filter(r => r.completed);

        totalResourcesCompleted += completedResources.length;

        // Estimate realistic time: 30-45 minutes per completed resource
        pathwayHours += completedResources.length * 0.6; // 36 minutes average

        if (module.quiz.completed && module.quiz.score) {
          quizScoreSum += module.quiz.score;
          totalQuizzes++;
          // Add 20 minutes per completed quiz
          pathwayHours += 0.33; // 20 minutes
        }
      });

      totalSessionTime += pathwayHours;
    });

    // Set realistic learning stats
    learningStats.totalHoursSpent = Math.round(totalSessionTime);
    learningStats.completedResources = totalResourcesCompleted;

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
      const currentModuleIndex = Math.min(
        pathway.currentModule,
        pathway.goalId.modules.length - 1
      );
      const currentModule = pathway.goalId.modules[currentModuleIndex];

      // Calculate realistic completion date based on remaining work
      const remainingModules =
        pathway.goalId.modules.length - pathway.currentModule;
      const estimatedDaysRemaining = remainingModules * 7; // 1 week per module
      const estimatedCompletion = new Date(
        Date.now() + estimatedDaysRemaining * 24 * 60 * 60 * 1000
      );

      return {
        goalTitle: pathway.goalId.title,
        moduleName: currentModule ? currentModule.title : "Module suivant",
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

  // Calculate realistic streak (max 30 days for demo)
  const sortedDates = Array.from(activityDates).sort().reverse();

  if (sortedDates.length === 0) return 0;

  let streak = 1;
  const today = new Date().toISOString().split("T")[0];

  // Check if user was active today or yesterday
  if (
    sortedDates[0] === today ||
    new Date(sortedDates[0]).getTime() >= Date.now() - 24 * 60 * 60 * 1000
  ) {
    // Count consecutive days from most recent
    for (let i = 1; i < Math.min(sortedDates.length, 30); i++) {
      const currentDate = new Date(sortedDates[i - 1]);
      const previousDate = new Date(sortedDates[i]);
      const dayDiff =
        (currentDate.getTime() - previousDate.getTime()) /
        (24 * 60 * 60 * 1000);

      if (dayDiff <= 1) {
        streak++;
      } else {
        break;
      }
    }
  } else {
    streak = 0; // No recent activity
  }

  return Math.min(streak, 30); // Cap at 30 days for realism
}

export const pathwayRoutes = router;
