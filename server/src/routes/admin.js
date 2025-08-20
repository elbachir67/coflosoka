import express from "express";
import { adminAuth } from "../middleware/auth.js";
import {
  User,
  Goal,
  LearnerProfile,
  Pathway,
  Quiz,
  Achievement,
} from "../models/index.js";
import { logger } from "../utils/logger.js";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const execAsync = promisify(exec);

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database operations
router.post("/database/:operation", adminAuth, async (req, res) => {
  try {
    const { operation } = req.params;
    const scriptsPath = path.join(__dirname, "../scripts");

    logger.info(
      `Admin ${req.user.email} initiated database operation: ${operation}`
    );

    switch (operation) {
      case "reset":
        // Reset database completely
        await execAsync(`node ${path.join(scriptsPath, "resetDatabase.js")}`);
        logger.info("Database reset completed");
        res.json({
          success: true,
          message: "Base de données réinitialisée avec succès",
        });
        break;

      case "populate":
        // Populate with demo data
        await execAsync(
          `node ${path.join(scriptsPath, "populateInitialData.js")}`
        );
        await execAsync(
          `node ${path.join(scriptsPath, "populateAchievements.js")}`
        );
        await execAsync(
          `node ${path.join(scriptsPath, "populateCollaborativeData.js")}`
        );
        logger.info("Database population completed");
        res.json({
          success: true,
          message: "Données de démonstration ajoutées avec succès",
        });
        break;

      case "backup":
        // Create database backup
        await execAsync(
          `node ${path.join(scriptsPath, "exportDatabase.js")} export`
        );
        logger.info("Database backup completed");
        res.json({
          success: true,
          message: "Sauvegarde créée avec succès",
        });
        break;

      default:
        res.status(400).json({ error: "Opération non reconnue" });
    }
  } catch (error) {
    logger.error(`Database operation ${req.params.operation} failed:`, error);
    res.status(500).json({
      error: `Erreur lors de l'opération ${req.params.operation}`,
      details: error.message,
    });
  }
});

// Export platform data
router.get("/export", adminAuth, async (req, res) => {
  try {
    const { format = "json" } = req.query;

    logger.info(
      `Admin ${req.user.email} requested data export in ${format} format`
    );

    // Gather all data
    const [users, goals, profiles, pathways, quizzes, achievements] =
      await Promise.all([
        User.find().select("-password"),
        Goal.find(),
        LearnerProfile.find(),
        Pathway.find(),
        Quiz.find(),
        Achievement.find(),
      ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      exportedBy: req.user.email,
      statistics: {
        users: users.length,
        goals: goals.length,
        profiles: profiles.length,
        pathways: pathways.length,
        quizzes: quizzes.length,
        achievements: achievements.length,
      },
      data: {
        users,
        goals,
        profiles,
        pathways,
        quizzes,
        achievements,
      },
    };

    if (format === "csv") {
      // Generate CSV for users
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=platform_data_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );

      let csv = "Type,Email,Role,Status,Created,LastLogin\n";
      users.forEach(user => {
        csv += `User,"${user.email}","${user.role}","${
          user.isActive ? "Active" : "Inactive"
        }","${user.createdAt}","${user.lastLogin || "Never"}"\n`;
      });

      res.send(csv);
    } else if (format === "excel") {
      // For Excel, return JSON (in real implementation, use exceljs)
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=platform_data_${
          new Date().toISOString().split("T")[0]
        }.json`
      );
      res.json(exportData);
    } else {
      // JSON format
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=platform_data_${
          new Date().toISOString().split("T")[0]
        }.json`
      );
      res.json(exportData);
    }

    logger.info(`Data export completed in ${format} format`);
  } catch (error) {
    logger.error("Error exporting platform data:", error);
    res.status(500).json({ error: "Erreur lors de l'export des données" });
  }
});

// Get platform statistics
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      newUsersThisWeek,
      totalGoals,
      totalPathways,
      completedPathways,
      activePathways,
      totalQuizzes,
      avgQuizScore,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      Goal.countDocuments(),
      Pathway.countDocuments(),
      Pathway.countDocuments({ status: "completed" }),
      Pathway.countDocuments({ status: "active" }),
      Quiz.countDocuments(),
      // Calculate average quiz score (simplified)
      75, // Mock average for now
    ]);

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisWeek: newUsersThisWeek,
        activeRate:
          totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
      },
      pathways: {
        total: totalPathways,
        completed: completedPathways,
        active: activePathways,
        completionRate:
          totalPathways > 0
            ? Math.round((completedPathways / totalPathways) * 100)
            : 0,
      },
      quizzes: {
        total: totalQuizzes,
        averageScore: avgQuizScore,
      },
      recentActivity: [
        {
          type: "user_registration",
          description: "Nouvel utilisateur inscrit",
          timestamp: new Date(),
        },
        {
          type: "pathway_completion",
          description: "Parcours complété",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          type: "quiz_completion",
          description: "Quiz complété avec score élevé",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        },
      ],
    };

    res.json(stats);
  } catch (error) {
    logger.error("Error fetching admin statistics:", error);
    res
      .status(500)
      .json({ error: "Erreur lors du chargement des statistiques" });
  }
});

// System health check
router.get("/health", adminAuth, async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? "healthy" : "error";

    // Check collections
    const collections = await mongoose.connection.db.collections();

    const health = {
      database: dbStatus,
      collections: collections.length,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };

    res.json(health);
  } catch (error) {
    logger.error("Error checking system health:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la vérification du système" });
  }
});

// Bulk operations
router.post("/bulk/:action", adminAuth, async (req, res) => {
  try {
    const { action } = req.params;
    const { ids, data } = req.body;

    logger.info(`Admin ${req.user.email} initiated bulk action: ${action}`);

    switch (action) {
      case "delete-users":
        if (!ids || !Array.isArray(ids)) {
          return res.status(400).json({ error: "IDs requis" });
        }

        await User.deleteMany({ _id: { $in: ids } });
        await LearnerProfile.deleteMany({ userId: { $in: ids } });
        await Pathway.deleteMany({ userId: { $in: ids } });

        res.json({
          success: true,
          message: `${ids.length} utilisateurs supprimés`,
        });
        break;

      case "activate-users":
        if (!ids || !Array.isArray(ids)) {
          return res.status(400).json({ error: "IDs requis" });
        }

        await User.updateMany(
          { _id: { $in: ids } },
          { $set: { isActive: true } }
        );

        res.json({
          success: true,
          message: `${ids.length} utilisateurs activés`,
        });
        break;

      case "deactivate-users":
        if (!ids || !Array.isArray(ids)) {
          return res.status(400).json({ error: "IDs requis" });
        }

        await User.updateMany(
          { _id: { $in: ids } },
          { $set: { isActive: false } }
        );

        res.json({
          success: true,
          message: `${ids.length} utilisateurs désactivés`,
        });
        break;

      default:
        res.status(400).json({ error: "Action non reconnue" });
    }
  } catch (error) {
    logger.error(`Bulk action ${req.params.action} failed:`, error);
    res.status(500).json({
      error: `Erreur lors de l'action groupée ${req.params.action}`,
    });
  }
});

export const adminRoutes = router;
