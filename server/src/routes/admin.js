import express from "express";
import { adminAuth } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();
const execAsync = promisify(exec);

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== DATABASE BOOTSTRAP ====================

// Bootstrap complete database
router.post("/bootstrap/complete", adminAuth, async (req, res) => {
  try {
    logger.info(
      `Admin ${req.user.email} initiated complete database bootstrap`
    );

    const scriptPath = path.join(__dirname, "../scripts/setupFullDatabase.js");

    // Execute the bootstrap script
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`);

    if (stderr) {
      logger.error("Bootstrap stderr:", stderr);
    }

    logger.info("Bootstrap stdout:", stdout);

    res.json({
      success: true,
      message: "Base de données initialisée avec succès",
      output: stdout,
    });
  } catch (error) {
    logger.error("Error during complete bootstrap:", error);
    res.status(500).json({
      error: "Erreur lors de l'initialisation complète",
      details: error.message,
    });
  }
});

// Populate initial data
router.post("/bootstrap/initial-data", adminAuth, async (req, res) => {
  try {
    logger.info(`Admin ${req.user.email} initiated initial data population`);

    const scriptPath = path.join(
      __dirname,
      "../scripts/populateInitialData.js"
    );
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`);

    if (stderr) {
      logger.error("Initial data stderr:", stderr);
    }

    res.json({
      success: true,
      message: "Données initiales peuplées avec succès",
      output: stdout,
    });
  } catch (error) {
    logger.error("Error populating initial data:", error);
    res.status(500).json({
      error: "Erreur lors du peuplement des données initiales",
      details: error.message,
    });
  }
});

// Populate achievements
router.post("/bootstrap/achievements", adminAuth, async (req, res) => {
  try {
    logger.info(`Admin ${req.user.email} initiated achievements population`);

    const scriptPath = path.join(
      __dirname,
      "../scripts/populateAchievements.js"
    );
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`);

    if (stderr) {
      logger.error("Achievements stderr:", stderr);
    }

    res.json({
      success: true,
      message: "Achievements peuplés avec succès",
      output: stdout,
    });
  } catch (error) {
    logger.error("Error populating achievements:", error);
    res.status(500).json({
      error: "Erreur lors du peuplement des achievements",
      details: error.message,
    });
  }
});

// Populate collaborative data
router.post("/bootstrap/collaborative", adminAuth, async (req, res) => {
  try {
    logger.info(
      `Admin ${req.user.email} initiated collaborative data population`
    );

    const scriptPath = path.join(
      __dirname,
      "../scripts/populateCollaborativeData.js"
    );
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`);

    if (stderr) {
      logger.error("Collaborative data stderr:", stderr);
    }

    res.json({
      success: true,
      message: "Données collaboratives peuplées avec succès",
      output: stdout,
    });
  } catch (error) {
    logger.error("Error populating collaborative data:", error);
    res.status(500).json({
      error: "Erreur lors du peuplement des données collaboratives",
      details: error.message,
    });
  }
});

// Populate demo data
router.post("/bootstrap/demo-data", adminAuth, async (req, res) => {
  try {
    logger.info(`Admin ${req.user.email} initiated demo data population`);

    const scriptPath = path.join(__dirname, "../scripts/populateDemoData.js");
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`);

    if (stderr) {
      logger.error("Demo data stderr:", stderr);
    }

    res.json({
      success: true,
      message: "Données de démonstration peuplées avec succès",
      output: stdout,
    });
  } catch (error) {
    logger.error("Error populating demo data:", error);
    res.status(500).json({
      error: "Erreur lors du peuplement des données de démonstration",
      details: error.message,
    });
  }
});

// Populate extensive data
router.post("/bootstrap/extensive-data", adminAuth, async (req, res) => {
  try {
    logger.info(`Admin ${req.user.email} initiated extensive data population`);

    const scriptPath = path.join(
      __dirname,
      "../scripts/populateExtensiveData.js"
    );
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`);

    if (stderr) {
      logger.error("Extensive data stderr:", stderr);
    }

    res.json({
      success: true,
      message: "Données étendues peuplées avec succès",
      output: stdout,
    });
  } catch (error) {
    logger.error("Error populating extensive data:", error);
    res.status(500).json({
      error: "Erreur lors du peuplement des données étendues",
      details: error.message,
    });
  }
});

// Reset database (DANGER)
router.post("/bootstrap/reset", adminAuth, async (req, res) => {
  try {
    const { confirmReset } = req.body;

    if (!confirmReset) {
      return res.status(400).json({
        error: "Confirmation requise pour réinitialiser la base de données",
      });
    }

    logger.warn(`Admin ${req.user.email} initiated database reset`);

    const scriptPath = path.join(__dirname, "../scripts/resetDatabase.js");
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`);

    if (stderr) {
      logger.error("Reset stderr:", stderr);
    }

    res.json({
      success: true,
      message: "Base de données réinitialisée avec succès",
      output: stdout,
    });
  } catch (error) {
    logger.error("Error resetting database:", error);
    res.status(500).json({
      error: "Erreur lors de la réinitialisation",
      details: error.message,
    });
  }
});

// Export database
router.post("/bootstrap/export", adminAuth, async (req, res) => {
  try {
    logger.info(`Admin ${req.user.email} initiated database export`);

    const scriptPath = path.join(__dirname, "../scripts/exportDatabase.js");
    const { stdout, stderr } = await execAsync(`node ${scriptPath} export`);

    if (stderr) {
      logger.error("Export stderr:", stderr);
    }

    res.json({
      success: true,
      message: "Base de données exportée avec succès",
      output: stdout,
    });
  } catch (error) {
    logger.error("Error exporting database:", error);
    res.status(500).json({
      error: "Erreur lors de l'export",
      details: error.message,
    });
  }
});

// Import database
router.post("/bootstrap/import", adminAuth, async (req, res) => {
  try {
    logger.info(`Admin ${req.user.email} initiated database import`);

    const scriptPath = path.join(__dirname, "../scripts/exportDatabase.js");
    const { stdout, stderr } = await execAsync(`node ${scriptPath} import`);

    if (stderr) {
      logger.error("Import stderr:", stderr);
    }

    res.json({
      success: true,
      message: "Base de données importée avec succès",
      output: stdout,
    });
  } catch (error) {
    logger.error("Error importing database:", error);
    res.status(500).json({
      error: "Erreur lors de l'import",
      details: error.message,
    });
  }
});

// Get bootstrap status
router.get("/bootstrap/status", adminAuth, async (req, res) => {
  try {
    // Import models to check database status
    const { User, Goal, Achievement, ForumPost, SharedResource, StudyGroup } =
      await import("../models/index.js");

    const status = {
      users: await User.countDocuments(),
      goals: await Goal.countDocuments(),
      achievements: await Achievement.countDocuments(),
      forumPosts: await ForumPost.countDocuments(),
      sharedResources: await SharedResource.countDocuments(),
      studyGroups: await StudyGroup.countDocuments(),
      lastUpdate: new Date().toISOString(),
    };

    res.json(status);
  } catch (error) {
    logger.error("Error getting bootstrap status:", error);
    res.status(500).json({
      error: "Erreur lors de la vérification du statut",
      details: error.message,
    });
  }
});

export const adminRoutes = router;
