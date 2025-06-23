import express from "express";
import { auth } from "../middleware/auth.js";
import AIRecommendationService from "../services/AIRecommendationService.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Obtenir des recommandations IA personnalisées
router.get("/recommendations", auth, async (req, res) => {
  try {
    const recommendations =
      await AIRecommendationService.generateSmartRecommendations(req.user.id);
    res.json(recommendations);
  } catch (error) {
    logger.error("Error getting AI recommendations:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la génération des recommandations" });
  }
});

// Analyser les patterns d'apprentissage
router.get("/learning-patterns", auth, async (req, res) => {
  try {
    const patterns = await AIRecommendationService.analyzeLearningPatterns(
      req.user.id
    );
    res.json(patterns);
  } catch (error) {
    logger.error("Error analyzing learning patterns:", error);
    res.status(500).json({ error: "Erreur lors de l'analyse des patterns" });
  }
});

export const aiRoutes = router;
