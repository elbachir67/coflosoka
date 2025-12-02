import express from "express";
import { body, validationResult } from "express-validator";
import TutorService from "../services/TutorService.js";
import { auth } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Validation pour les questions
const askValidation = [
  body("question")
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage("La question doit contenir entre 3 et 500 caractères"),
  body("category")
    .optional()
    .isIn(["ml", "dl", "nlp", "cv", "math", "python"])
    .withMessage("Catégorie invalide"),
  body("language")
    .optional()
    .isIn(["fr", "en"])
    .withMessage("Langue invalide (fr ou en)")
];

// GET /api/tutor/categories - Récupérer les catégories disponibles
router.get("/categories", (req, res) => {
  try {
    const categories = TutorService.getCategories();
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    logger.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des catégories"
    });
  }
});

// GET /api/tutor/questions/:categoryId - Récupérer les questions suggérées
router.get("/questions/:categoryId", (req, res) => {
  try {
    const { categoryId } = req.params;
    const questions = TutorService.getSuggestedQuestions(categoryId);
    res.json({
      success: true,
      category: categoryId,
      questions
    });
  } catch (error) {
    logger.error("Error fetching suggested questions:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des questions"
    });
  }
});

// POST /api/tutor/ask - Poser une question au tuteur (requiert authentification)
router.post("/ask", auth, askValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { question, category = "ml", language = "fr" } = req.body;

    logger.info(`User ${req.user.email} asking tutor - Category: ${category}`);

    const result = await TutorService.askTutor(question, category, language);

    if (result.success) {
      res.json({
        success: true,
        data: {
          question,
          answer: result.response,
          category: result.category,
          language: result.language,
          model: result.model
        }
      });
    } else {
      res.status(503).json({
        success: false,
        error: result.error,
        message: result.response
      });
    }
  } catch (error) {
    logger.error("Error in tutor ask endpoint:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors du traitement de la question"
    });
  }
});

// GET /api/tutor/status - Vérifier le statut du service tuteur
router.get("/status", async (req, res) => {
  try {
    const status = await TutorService.checkModelAvailability();
    res.json({
      success: true,
      status: {
        ollamaAvailable: status.available,
        tinyLlamaReady: status.hasTinyLlama,
        availableModels: status.models
      }
    });
  } catch (error) {
    logger.error("Error checking tutor status:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la vérification du statut"
    });
  }
});

export const tutorRoutes = router;
