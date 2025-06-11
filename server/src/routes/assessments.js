import express from "express";
import { Assessment } from "../models/Assessment.js";
import { Goal } from "../models/LearningGoal.js";
import { LearnerProfile } from "../models/LearnerProfile.js";
import { auth } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";
import {
  ASSESSMENT_QUESTIONS,
  QUESTION_CONFIGS,
} from "../data/assessmentQuestions.js";
import {
  calculateOverallScore,
  analyzePerformanceByCategory,
  generatePersonalizedRecommendations,
} from "../utils/scoringSystem.js";

const router = express.Router();

// Get assessment questions by category
router.get("/questions", async (req, res) => {
  try {
    const { domain } = req.query;
    const questionsPerCategory =
      QUESTION_CONFIGS.assessment.questionsPerCategory;

    let questions = [];

    if (domain && ASSESSMENT_QUESTIONS[domain]) {
      // Sélectionner aléatoirement des questions pour le domaine spécifié
      const domainQuestions = ASSESSMENT_QUESTIONS[domain];
      const shuffled = domainQuestions.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, questionsPerCategory);

      questions = selected.map((q, index) => ({
        id: `${domain}_${index}`,
        text: q.text,
        category: domain,
        difficulty: q.difficulty,
        options: q.options.map((opt, optIndex) => ({
          id: `${domain}_${index}_${optIndex}`,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
        explanation: q.explanation,
      }));
    } else {
      // Sélectionner des questions de toutes les catégories
      Object.entries(ASSESSMENT_QUESTIONS).forEach(
        ([category, categoryQuestions]) => {
          const shuffled = categoryQuestions.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(
            0,
            Math.min(2, categoryQuestions.length)
          ); // 2 questions par catégorie

          const categoryQs = selected.map((q, index) => ({
            id: `${category}_${index}`,
            text: q.text,
            category: category,
            difficulty: q.difficulty,
            options: q.options.map((opt, optIndex) => ({
              id: `${category}_${index}_${optIndex}`,
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
            explanation: q.explanation,
          }));

          questions.push(...categoryQs);
        }
      );
    }

    // Mélanger les questions finales
    questions = questions.sort(() => 0.5 - Math.random());

    res.json(questions);
  } catch (error) {
    logger.error("Error fetching assessment questions:", error);
    res.status(500).json({ error: "Error fetching questions" });
  }
});

// Submit assessment results with advanced scoring
router.post("/submit", auth, async (req, res) => {
  try {
    const { category, responses } = req.body;
    const userId = req.user.id;

    // Validate category
    const validCategories = [
      "math",
      "programming",
      "ml",
      "dl",
      "computer_vision",
      "nlp",
      "mlops",
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Must be one of: ${validCategories.join(
          ", "
        )}`,
      });
    }

    // Récupérer les questions pour calculer le score
    const questions = [];
    if (ASSESSMENT_QUESTIONS[category]) {
      ASSESSMENT_QUESTIONS[category].forEach((q, index) => {
        questions.push({
          id: `${category}_${index}`,
          text: q.text,
          category: category,
          difficulty: q.difficulty,
          options: q.options,
          explanation: q.explanation,
        });
      });
    }

    // Calculer le score avec le nouveau système
    const score = calculateOverallScore(questions, responses);

    // Analyser les performances par catégorie
    const categoryStats = analyzePerformanceByCategory(questions, responses);

    // Générer des recommandations personnalisées
    const recommendations = generatePersonalizedRecommendations(categoryStats, {
      mathLevel: "intermediate",
      programmingLevel: "intermediate",
      domain: category,
    });

    // Format recommendations for database
    const formattedRecommendations = [
      {
        category: category,
        score: score,
        recommendations: recommendations.map(r => r.message),
      },
    ];

    // Find and update or create learner profile
    const learnerProfile = await LearnerProfile.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: {
          userId,
          learningStyle: "visual",
          preferences: {
            mathLevel: "beginner",
            programmingLevel: "beginner",
            preferredDomain: category,
          },
        },
        $push: {
          assessments: {
            category,
            score,
            responses,
            recommendations: formattedRecommendations,
            completedAt: new Date(),
          },
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    // Update preferences based on score
    const recommendedLevel =
      score >= 80 ? "advanced" : score >= 50 ? "intermediate" : "beginner";

    // Update appropriate level
    let updateQuery = {};
    switch (category) {
      case "math":
        updateQuery = { "preferences.mathLevel": recommendedLevel };
        break;
      case "programming":
        updateQuery = { "preferences.programmingLevel": recommendedLevel };
        break;
      default:
        updateQuery = { "preferences.preferredDomain": category };
    }

    // Update preferences in a separate operation
    await LearnerProfile.findByIdAndUpdate(
      learnerProfile._id,
      { $set: updateQuery },
      { runValidators: true }
    );

    // Fetch updated profile
    const updatedProfile = await LearnerProfile.findById(learnerProfile._id);

    res.json({
      success: true,
      profile: updatedProfile,
      detailedResults: {
        score,
        categoryStats,
        recommendations,
      },
    });
  } catch (error) {
    logger.error("Error submitting assessment:", error);
    if (error.code === 11000) {
      logger.error("Duplicate key error:", error);
      res.status(400).json({ error: "Profile already exists for this user" });
    } else {
      res.status(500).json({ error: "Error submitting assessment" });
    }
  }
});

// Get assessment history
router.get("/history", auth, async (req, res) => {
  try {
    const profile = await LearnerProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.json([]);
    }

    const assessments = profile.assessments.sort(
      (a, b) => b.completedAt - a.completedAt
    );

    res.json(assessments);
  } catch (error) {
    logger.error("Error fetching assessment history:", error);
    res.status(500).json({ error: "Error fetching assessment history" });
  }
});

export default router;
