import mongoose from "mongoose";
import { Achievement } from "../models/Achievement.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB for achievements population");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

const achievements = [
  // Achievements liés à l'apprentissage
  {
    title: "Premier pas",
    description: "Compléter votre première ressource d'apprentissage",
    category: "learning",
    icon: "BookOpen",
    points: 10,
    criteria: {
      type: "resources_completed",
      threshold: 1,
    },
    rarity: "common",
    badgeUrl: "https://ucad.sn/badges/first-step.png",
  },
  {
    title: "Apprenti studieux",
    description: "Compléter 10 ressources d'apprentissage",
    category: "learning",
    icon: "BookOpen",
    points: 25,
    criteria: {
      type: "resources_completed",
      threshold: 10,
    },
    rarity: "common",
    badgeUrl: "https://ucad.sn/badges/diligent-learner.png",
  },
  {
    title: "Chercheur de connaissances",
    description: "Compléter 50 ressources d'apprentissage",
    category: "learning",
    icon: "BookOpen",
    points: 100,
    criteria: {
      type: "resources_completed",
      threshold: 50,
    },
    rarity: "uncommon",
    badgeUrl: "https://ucad.sn/badges/knowledge-seeker.png",
  },
  {
    title: "Érudit",
    description: "Compléter 100 ressources d'apprentissage",
    category: "learning",
    icon: "BookOpen",
    points: 250,
    criteria: {
      type: "resources_completed",
      threshold: 100,
    },
    rarity: "rare",
    badgeUrl: "https://ucad.sn/badges/scholar.png",
  },

  // Achievements liés aux modules
  {
    title: "Premier module",
    description: "Compléter votre premier module d'apprentissage",
    category: "learning",
    icon: "Layers",
    points: 25,
    criteria: {
      type: "complete_modules",
      threshold: 1,
    },
    rarity: "common",
    badgeUrl: "https://ucad.sn/badges/first-module.png",
  },
  {
    title: "Progression constante",
    description: "Compléter 5 modules d'apprentissage",
    category: "learning",
    icon: "Layers",
    points: 75,
    criteria: {
      type: "complete_modules",
      threshold: 5,
    },
    rarity: "uncommon",
    badgeUrl: "https://ucad.sn/badges/steady-progress.png",
  },
  {
    title: "Expert en modules",
    description: "Compléter 20 modules d'apprentissage",
    category: "learning",
    icon: "Layers",
    points: 200,
    criteria: {
      type: "complete_modules",
      threshold: 20,
    },
    rarity: "rare",
    badgeUrl: "https://ucad.sn/badges/module-master.png",
  },

  // Achievements liés aux parcours
  {
    title: "Premier parcours",
    description: "Compléter votre premier parcours d'apprentissage",
    category: "learning",
    icon: "Map",
    points: 100,
    criteria: {
      type: "complete_pathways",
      threshold: 1,
    },
    rarity: "uncommon",
    badgeUrl: "https://ucad.sn/badges/first-pathway.png",
  },
  {
    title: "Explorateur de parcours",
    description: "Compléter 3 parcours d'apprentissage différents",
    category: "learning",
    icon: "Map",
    points: 300,
    criteria: {
      type: "complete_pathways",
      threshold: 3,
    },
    rarity: "rare",
    badgeUrl: "https://ucad.sn/badges/pathway-explorer.png",
  },
  {
    title: "Maître des parcours",
    description: "Compléter 5 parcours d'apprentissage différents",
    category: "learning",
    icon: "Map",
    points: 500,
    criteria: {
      type: "complete_pathways",
      threshold: 5,
    },
    rarity: "epic",
    badgeUrl: "https://ucad.sn/badges/pathway-master.png",
  },

  // Achievements liés aux quiz
  {
    title: "Premier quiz",
    description: "Compléter votre premier quiz",
    category: "learning",
    icon: "CheckSquare",
    points: 15,
    criteria: {
      type: "quiz_score",
      threshold: 1,
    },
    rarity: "common",
    badgeUrl: "https://ucad.sn/badges/first-quiz.png",
  },
  {
    title: "Maître du quiz",
    description: "Obtenir un score parfait (100%) sur un quiz",
    category: "learning",
    icon: "Award",
    points: 50,
    criteria: {
      type: "quiz_score",
      threshold: 100,
    },
    rarity: "uncommon",
    badgeUrl: "https://ucad.sn/badges/quiz-master.png",
  },
  {
    title: "Expert en quiz",
    description: "Obtenir un score moyen de 90% sur 10 quiz",
    category: "learning",
    icon: "Award",
    points: 150,
    criteria: {
      type: "quiz_score",
      threshold: 90,
      additionalParams: {
        minQuizCount: 10,
      },
    },
    rarity: "rare",
    badgeUrl: "https://ucad.sn/badges/quiz-expert.png",
  },

  // Achievements liés à l'engagement
  {
    title: "Première connexion",
    description: "Se connecter pour la première fois",
    category: "engagement",
    icon: "LogIn",
    points: 5,
    criteria: {
      type: "special_event",
      threshold: 1,
    },
    rarity: "common",
    badgeUrl: "https://ucad.sn/badges/first-login.png",
  },
  {
    title: "Série de 3 jours",
    description: "Se connecter 3 jours consécutifs",
    category: "engagement",
    icon: "Calendar",
    points: 15,
    criteria: {
      type: "streak_days",
      threshold: 3,
    },
    rarity: "common",
    badgeUrl: "https://ucad.sn/badges/3-day-streak.png",
  },
  {
    title: "Série de 7 jours",
    description: "Se connecter 7 jours consécutifs",
    category: "engagement",
    icon: "Calendar",
    points: 50,
    criteria: {
      type: "streak_days",
      threshold: 7,
    },
    rarity: "uncommon",
    badgeUrl: "https://ucad.sn/badges/7-day-streak.png",
  },
  {
    title: "Série de 30 jours",
    description: "Se connecter 30 jours consécutifs",
    category: "engagement",
    icon: "Calendar",
    points: 200,
    criteria: {
      type: "streak_days",
      threshold: 30,
    },
    rarity: "rare",
    badgeUrl: "https://ucad.sn/badges/30-day-streak.png",
  },
  {
    title: "Série de 100 jours",
    description: "Se connecter 100 jours consécutifs",
    category: "engagement",
    icon: "Calendar",
    points: 500,
    criteria: {
      type: "streak_days",
      threshold: 100,
    },
    rarity: "legendary",
    badgeUrl: "https://ucad.sn/badges/100-day-streak.png",
  },

  // Achievements liés au temps passé
  {
    title: "Première heure",
    description: "Passer 1 heure sur la plateforme",
    category: "engagement",
    icon: "Clock",
    points: 10,
    criteria: {
      type: "time_spent",
      threshold: 1,
    },
    rarity: "common",
    badgeUrl: "https://ucad.sn/badges/first-hour.png",
  },
  {
    title: "Apprenti dévoué",
    description: "Passer 10 heures sur la plateforme",
    category: "engagement",
    icon: "Clock",
    points: 50,
    criteria: {
      type: "time_spent",
      threshold: 10,
    },
    rarity: "uncommon",
    badgeUrl: "https://ucad.sn/badges/dedicated-learner.png",
  },
  {
    title: "Expert en formation",
    description: "Passer 50 heures sur la plateforme",
    category: "engagement",
    icon: "Clock",
    points: 150,
    criteria: {
      type: "time_spent",
      threshold: 50,
    },
    rarity: "rare",
    badgeUrl: "https://ucad.sn/badges/training-expert.png",
  },
  {
    title: "Maître du temps",
    description: "Passer 100 heures sur la plateforme",
    category: "engagement",
    icon: "Clock",
    points: 300,
    criteria: {
      type: "time_spent",
      threshold: 100,
    },
    rarity: "epic",
    badgeUrl: "https://ucad.sn/badges/time-master.png",
  },

  // Achievements spéciaux
  {
    title: "Pionnier de l'IA",
    description: "Être parmi les 100 premiers utilisateurs de la plateforme",
    category: "special",
    icon: "Star",
    points: 100,
    criteria: {
      type: "special_event",
      threshold: 1,
    },
    rarity: "legendary",
    badgeUrl: "https://ucad.sn/badges/ai-pioneer.png",
  },
  {
    title: "Mentor en herbe",
    description: "Aider 5 autres apprenants sur le forum",
    category: "special",
    icon: "Users",
    points: 100,
    criteria: {
      type: "special_event",
      threshold: 5,
    },
    rarity: "rare",
    badgeUrl: "https://ucad.sn/badges/budding-mentor.png",
    isHidden: true,
  },
];

async function populateAchievements() {
  try {
    await connectDB();

    // Vérifier si des achievements existent déjà
    const existingCount = await Achievement.countDocuments();

    if (existingCount > 0) {
      logger.info(
        `${existingCount} achievements already exist in the database`
      );
      const shouldContinue = process.argv.includes("--force");

      if (!shouldContinue) {
        logger.info("Use --force to overwrite existing achievements");
        process.exit(0);
      }

      logger.info("Removing existing achievements...");
      await Achievement.deleteMany({});
    }

    // Insérer les achievements
    await Achievement.insertMany(achievements);

    logger.info(`Successfully populated ${achievements.length} achievements`);

    // Afficher les statistiques
    const stats = {
      total: achievements.length,
      byCategory: {
        learning: achievements.filter(a => a.category === "learning").length,
        engagement: achievements.filter(a => a.category === "engagement")
          .length,
        milestone: achievements.filter(a => a.category === "milestone").length,
        special: achievements.filter(a => a.category === "special").length,
      },
      byRarity: {
        common: achievements.filter(a => a.rarity === "common").length,
        uncommon: achievements.filter(a => a.rarity === "uncommon").length,
        rare: achievements.filter(a => a.rarity === "rare").length,
        epic: achievements.filter(a => a.rarity === "epic").length,
        legendary: achievements.filter(a => a.rarity === "legendary").length,
      },
    };

    logger.info("Achievement statistics:", stats);
  } catch (error) {
    logger.error("Error populating achievements:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

populateAchievements();
