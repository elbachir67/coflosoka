// server/src/routes/analytics.js
import express from "express";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/auth.js";
import { Pathway } from "../models/Pathway.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { User } from "../models/User.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Obtenir les données analytiques pour l'utilisateur
router.get("/user", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer les parcours de l'utilisateur
    const pathways = await Pathway.find({ userId }).populate("goalId");

    // Récupérer les tentatives de quiz
    const quizAttempts = await QuizAttempt.find({ userId });

    // Calculer le temps d'apprentissage total (en heures)
    const totalLearningTime = pathways.reduce((total, pathway) => {
      const startDate = new Date(pathway.startedAt);
      const lastDate = new Date(pathway.lastAccessedAt);
      const hoursSpent = Math.round(
        (lastDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
      );
      return total + hoursSpent;
    }, 0);

    // Calculer le taux de complétion
    const completionRate =
      pathways.length > 0
        ? Math.round(
            (pathways.filter(p => p.status === "completed").length /
              pathways.length) *
              100
          )
        : 0;

    // Calculer le score moyen aux quiz
    const totalScores = quizAttempts.reduce(
      (sum, attempt) => sum + attempt.score,
      0
    );
    const averageScore =
      quizAttempts.length > 0
        ? Math.round(totalScores / quizAttempts.length)
        : 0;

    // Calculer les jours d'activité
    const activityDates = new Set();
    pathways.forEach(pathway => {
      pathway.moduleProgress.forEach(module => {
        module.resources.forEach(resource => {
          if (resource.completedAt) {
            activityDates.add(resource.completedAt.toISOString().split("T")[0]);
          }
        });
        if (module.quiz.completedAt) {
          activityDates.add(
            module.quiz.completedAt.toISOString().split("T")[0]
          );
        }
      });
    });
    const activeDays = activityDates.size;

    // Générer des recommandations basées sur les performances
    const recommendations = generateRecommendations(pathways, quizAttempts);

    res.json({
      totalLearningTime,
      completionRate,
      averageScore,
      activeDays,
      recommendations,
    });
  } catch (error) {
    logger.error("Error fetching user analytics:", error);
    res
      .status(500)
      .json({ error: "Erreur lors du chargement des données analytiques" });
  }
});

// Obtenir les données analytiques pour l'admin
router.get("/admin", adminAuth, async (req, res) => {
  try {
    // Statistiques des utilisateurs
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // Statistiques des parcours
    const totalPathways = await Pathway.countDocuments();
    const completedPathways = await Pathway.countDocuments({
      status: "completed",
    });
    const activePathways = await Pathway.countDocuments({ status: "active" });

    // Statistiques des quiz
    const quizAttempts = await QuizAttempt.find();
    const totalQuizzes = quizAttempts.length;
    const averageScore =
      totalQuizzes > 0
        ? Math.round(
            quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
              totalQuizzes
          )
        : 0;

    // Taux de complétion global
    const completionRate =
      totalPathways > 0
        ? Math.round((completedPathways / totalPathways) * 100)
        : 0;

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisWeek: newUsersThisWeek,
        activeRate: Math.round((activeUsers / totalUsers) * 100),
      },
      pathways: {
        total: totalPathways,
        completed: completedPathways,
        active: activePathways,
        completionRate,
      },
      quizzes: {
        total: totalQuizzes,
        averageScore,
      },
      recentActivity: generateRecentActivity(),
    });
  } catch (error) {
    logger.error("Error fetching admin analytics:", error);
    res
      .status(500)
      .json({ error: "Erreur lors du chargement des données analytiques" });
  }
});

// Exporter les données analytiques
router.get("/export", auth, async (req, res) => {
  try {
    const { format = "csv" } = req.query;
    const userId = req.user.id;

    // Récupérer les données
    const pathways = await Pathway.find({ userId }).populate("goalId");
    const quizAttempts = await QuizAttempt.find({ userId });

    // Préparer les données pour l'export
    const exportData = {
      user: req.user.email,
      pathways: pathways.map(p => ({
        title: p.goalId.title,
        status: p.status,
        progress: p.progress,
        startedAt: p.startedAt,
        lastAccessedAt: p.lastAccessedAt,
      })),
      quizzes: quizAttempts.map(q => ({
        score: q.score,
        completedAt: q.completedAt,
        timeSpent: q.totalTimeSpent,
      })),
    };

    // Générer le fichier selon le format demandé
    if (format === "csv") {
      // Générer CSV
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=analytics_${userId}.csv`
      );

      // Exemple simple de conversion en CSV
      let csv = "Parcours,Statut,Progression,Date de début,Dernière activité\n";
      exportData.pathways.forEach(p => {
        csv += `"${p.title}","${p.status}",${p.progress},"${p.startedAt}","${p.lastAccessedAt}"\n`;
      });

      res.send(csv);
    } else if (format === "excel") {
      // Pour Excel, on renvoie juste un JSON pour l'exemple
      // Dans une implémentation réelle, on utiliserait une bibliothèque comme exceljs
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=analytics_${userId}.json`
      );
      res.json(exportData);
    } else {
      res.status(400).json({ error: "Format non supporté" });
    }
  } catch (error) {
    logger.error("Error exporting analytics:", error);
    res.status(500).json({ error: "Erreur lors de l'export des données" });
  }
});

// Fonctions utilitaires
function generateRecommendations(pathways, quizAttempts) {
  // Exemple de recommandations basées sur les données
  const recommendations = [];

  // Recommandation basée sur l'activité
  if (pathways.some(p => p.status === "active" && p.progress < 30)) {
    recommendations.push({
      title: "Continuez votre progression",
      description:
        "Vous avez des parcours en cours avec une progression faible. Essayez de consacrer 30 minutes par jour pour avancer.",
    });
  }

  // Recommandation basée sur les quiz
  if (quizAttempts.length > 0) {
    const avgScore =
      quizAttempts.reduce((sum, q) => sum + q.score, 0) / quizAttempts.length;
    if (avgScore < 70) {
      recommendations.push({
        title: "Améliorez vos scores aux quiz",
        description:
          "Vos scores aux quiz sont en dessous de 70%. Révisez les concepts clés avant de passer les quiz.",
      });
    }
  }

  // Recommandation pour la diversification
  const categories = new Set(pathways.map(p => p.goalId.category));
  if (categories.size < 2) {
    recommendations.push({
      title: "Diversifiez vos compétences",
      description:
        "Essayez d'explorer d'autres domaines de l'IA pour élargir vos compétences.",
    });
  }

  return recommendations;
}

function generateRecentActivity() {
  // Simuler des activités récentes pour l'admin
  return [
    {
      type: "user_registration",
      description: "Nouvel utilisateur inscrit",
      timestamp: new Date(),
      userId: "user123",
    },
    {
      type: "pathway_completion",
      description: "Parcours complété",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      userId: "user456",
    },
    {
      type: "quiz_completion",
      description: "Quiz complété avec score élevé",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      userId: "user789",
    },
  ];
}

export default router;
