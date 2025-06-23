import express from "express";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/auth.js";
import GamificationService from "../services/GamificationService.js";
import { Achievement, UserAchievement, UserLevel } from "../models/index.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Obtenir les données de gamification de l'utilisateur
router.get("/profile", auth, async (req, res) => {
  try {
    const gamificationData = await GamificationService.getUserGamificationData(
      req.user.id
    );
    res.json(gamificationData);
  } catch (error) {
    logger.error("Error getting gamification profile:", error);
    res
      .status(500)
      .json({ error: "Erreur lors du chargement du profil de gamification" });
  }
});

// Marquer un achievement comme vu
router.put("/achievements/:achievementId/view", auth, async (req, res) => {
  try {
    const { achievementId } = req.params;
    const success = await GamificationService.markAchievementAsViewed(
      req.user.id,
      achievementId
    );

    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Achievement non trouvé" });
    }
  } catch (error) {
    logger.error("Error marking achievement as viewed:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

// Récompenser une action
router.post("/reward", auth, async (req, res) => {
  try {
    const { action, additionalParams } = req.body;

    if (!action) {
      return res.status(400).json({ error: "Action non spécifiée" });
    }

    const result = await GamificationService.rewardAction(
      req.user.id,
      action,
      additionalParams
    );

    res.json(result);
  } catch (error) {
    logger.error("Error rewarding action:", error);
    res.status(500).json({ error: "Erreur lors de la récompense de l'action" });
  }
});

// Obtenir le classement des utilisateurs
router.get("/leaderboard", auth, async (req, res) => {
  try {
    const leaderboard = await UserLevel.find()
      .sort({ totalXP: -1 })
      .limit(10)
      .populate("userId", "email");

    res.json(leaderboard);
  } catch (error) {
    logger.error("Error getting leaderboard:", error);
    res.status(500).json({ error: "Erreur lors du chargement du classement" });
  }
});

// Routes d'administration des achievements (admin seulement)
router.post("/achievements", adminAuth, async (req, res) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    logger.error("Error creating achievement:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'achievement" });
  }
});

router.get("/achievements", auth, async (req, res) => {
  try {
    const achievements = await Achievement.find({ isHidden: false });
    res.json(achievements);
  } catch (error) {
    logger.error("Error getting achievements:", error);
    res
      .status(500)
      .json({ error: "Erreur lors du chargement des achievements" });
  }
});

router.put("/achievements/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const achievement = await Achievement.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!achievement) {
      return res.status(404).json({ error: "Achievement non trouvé" });
    }

    res.json(achievement);
  } catch (error) {
    logger.error("Error updating achievement:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l'achievement" });
  }
});

router.delete("/achievements/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const achievement = await Achievement.findByIdAndDelete(id);

    if (!achievement) {
      return res.status(404).json({ error: "Achievement non trouvé" });
    }

    // Supprimer également les références utilisateur
    await UserAchievement.deleteMany({ achievementId: id });

    res.json({ success: true });
  } catch (error) {
    logger.error("Error deleting achievement:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'achievement" });
  }
});

export const gamificationRoutes = router;
