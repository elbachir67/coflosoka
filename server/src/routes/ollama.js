import express from "express";
import { auth } from "../middleware/auth.js";
import OllamaService from "../services/OllamaService.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Vérifier le statut d'Ollama
router.get("/health", auth, async (req, res) => {
  try {
    const health = await OllamaService.checkHealth();
    res.json(health);
  } catch (error) {
    logger.error("Error checking Ollama health:", error);
    res.status(500).json({ error: "Erreur lors de la vérification d'Ollama" });
  }
});

// Lister les modèles disponibles
router.get("/models", auth, async (req, res) => {
  try {
    const models = await OllamaService.listModels();
    res.json(models);
  } catch (error) {
    logger.error("Error listing Ollama models:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des modèles" });
  }
});

// Générer une réponse simple
router.post("/generate", auth, async (req, res) => {
  try {
    const { prompt, model, temperature, maxTokens } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Le prompt est requis" });
    }

    const response = await OllamaService.generateResponse(prompt, {
      model,
      temperature,
      maxTokens,
    });

    res.json(response);
  } catch (error) {
    logger.error("Error generating response with Ollama:", error);
    res.status(500).json({ error: "Erreur lors de la génération de réponse" });
  }
});

// Chat avec contexte
router.post("/chat", auth, async (req, res) => {
  try {
    const { messages, model, temperature, maxTokens } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Les messages sont requis" });
    }

    const response = await OllamaService.chat(messages, {
      model,
      temperature,
      maxTokens,
    });

    res.json(response);
  } catch (error) {
    logger.error("Error in Ollama chat:", error);
    res.status(500).json({ error: "Erreur lors du chat avec Ollama" });
  }
});

// Générer du code
router.post("/generate-code", auth, async (req, res) => {
  try {
    const { description, language, context } = req.body;

    if (!description) {
      return res.status(400).json({ error: "La description est requise" });
    }

    const response = await OllamaService.generateCode(
      description,
      language,
      context
    );
    res.json(response);
  } catch (error) {
    logger.error("Error generating code with Ollama:", error);
    res.status(500).json({ error: "Erreur lors de la génération de code" });
  }
});

// Expliquer du code
router.post("/explain-code", auth, async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Le code est requis" });
    }

    const response = await OllamaService.explainCode(code, language);
    res.json(response);
  } catch (error) {
    logger.error("Error explaining code with Ollama:", error);
    res.status(500).json({ error: "Erreur lors de l'explication du code" });
  }
});

// Générer des questions de quiz
router.post("/generate-quiz", auth, async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Le sujet est requis" });
    }

    const questions = await OllamaService.generateQuizQuestions(
      topic,
      difficulty,
      count
    );
    res.json({ questions });
  } catch (error) {
    logger.error("Error generating quiz with Ollama:", error);
    res.status(500).json({ error: "Erreur lors de la génération du quiz" });
  }
});

// Générer des recommandations personnalisées
router.post("/recommendations", auth, async (req, res) => {
  try {
    const { userProfile, learningHistory } = req.body;

    if (!userProfile) {
      return res
        .status(400)
        .json({ error: "Le profil utilisateur est requis" });
    }

    const recommendations =
      await OllamaService.generatePersonalizedRecommendations(
        userProfile,
        learningHistory
      );

    res.json(recommendations);
  } catch (error) {
    logger.error("Error generating recommendations with Ollama:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la génération des recommandations" });
  }
});

export const ollamaRoutes = router;
