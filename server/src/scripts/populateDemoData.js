/**
 * Script to populate the database with demo data for testing
 */

import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("MongoDB Connected: " + mongoose.connection.host);
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

async function populateDemoData() {
  try {
    await connectDB();

    // Import all models to ensure they are registered
    const {
      User,
      Goal,
      LearnerProfile,
      Pathway,
      UserLevel,
      Achievement,
      UserAchievement,
      ForumPost,
      SharedResource,
      StudyGroup,
    } = await import("../models/index.js");

    logger.info("Starting demo data population...");

    // Create demo users
    const demoUsers = [
      {
        email: "student@ucad.edu.sn",
        password: "Student123!",
        role: "user",
        isActive: true,
      },
      {
        email: "admin@ucad.edu.sn",
        password: "Admin123!",
        role: "admin",
        isActive: true,
      },
      {
        email: "advanced@ucad.edu.sn",
        password: "Advanced123!",
        role: "user",
        isActive: true,
      },
      {
        email: "beginner@ucad.edu.sn",
        password: "Beginner123!",
        role: "user",
        isActive: true,
      },
    ];

    const createdUsers = [];

    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        logger.info(`User ${userData.email} already exists, skipping...`);
        createdUsers.push(existingUser);
        continue;
      }

      // Create new user
      const user = new User(userData);
      await user.save();
      logger.info(`Created user: ${userData.email}`);
      createdUsers.push(user);
    }

    // Create learner profiles
    const profileTemplates = [
      {
        // For student@ucad.edu.sn
        learningStyle: "visual",
        preferences: {
          mathLevel: "intermediate",
          programmingLevel: "intermediate",
          preferredDomain: "ml",
        },
      },
      {
        // For advanced@ucad.edu.sn
        learningStyle: "reading",
        preferences: {
          mathLevel: "advanced",
          programmingLevel: "advanced",
          preferredDomain: "dl",
        },
      },
      {
        // For beginner@ucad.edu.sn
        learningStyle: "kinesthetic",
        preferences: {
          mathLevel: "beginner",
          programmingLevel: "beginner",
          preferredDomain: "ml", // Changed from data_science to ml (valid enum)
        },
      },
    ];

    const regularUsers = createdUsers.filter(user => user.role === "user");

    for (
      let i = 0;
      i < Math.min(regularUsers.length, profileTemplates.length);
      i++
    ) {
      const user = regularUsers[i];
      const template = profileTemplates[i];

      // Check if profile already exists
      const existingProfile = await LearnerProfile.findOne({
        userId: user._id,
      });

      if (existingProfile) {
        logger.info(`Profile already exists for user: ${user.email}`);
        continue;
      }

      // Create profile
      const profile = new LearnerProfile({
        userId: user._id,
        ...template,
        assessments: [
          {
            category: "math",
            score: 75,
            completedAt: new Date(),
            recommendations: [
              {
                category: "math",
                score: 75,
                recommendations: [
                  "Réviser les concepts de calcul différentiel",
                  "Pratiquer les exercices de probabilités",
                ],
              },
            ],
          },
        ],
      });

      await profile.save();
      logger.info(`Created profile for user: ${user.email}`);
    }

    // Create gamification data
    for (const user of regularUsers) {
      // Create user level
      const existingLevel = await UserLevel.findOne({ userId: user._id });

      if (!existingLevel) {
        const isAdvanced = user.email.includes("advanced");
        const isBeginner = user.email.includes("beginner");

        const level = isAdvanced ? 15 : isBeginner ? 3 : 8;
        const totalXP = isAdvanced ? 5000 : isBeginner ? 250 : 1500;
        const currentXP = Math.floor(Math.random() * 100);
        const requiredXP = 100 + level * 25;
        const streakDays = isAdvanced ? 30 : isBeginner ? 2 : 12;

        const userLevel = new UserLevel({
          userId: user._id,
          level,
          currentXP,
          requiredXP,
          totalXP,
          streakDays,
          lastActivityDate: new Date(),
          rank:
            level >= 15
              ? "Expert"
              : level >= 10
              ? "Chercheur"
              : level >= 5
              ? "Étudiant"
              : "Novice",
        });

        await userLevel.save();
        logger.info(`Created user level for: ${user.email}`);
      }
    }

    // Create pathways
    const goals = await Goal.find();

    if (goals.length > 0) {
      for (const user of regularUsers) {
        // Get a random goal
        const goal = goals[Math.floor(Math.random() * goals.length)];

        // Check if pathway already exists
        const existingPathway = await Pathway.findOne({
          userId: user._id,
          goalId: goal._id,
        });

        if (existingPathway) {
          logger.info(
            `Pathway already exists for user ${user.email}, skipping...`
          );
          continue;
        }

        // Create module progress data
        const moduleProgress = goal.modules.map((module, index) => {
          const isAdvanced = user.email.includes("advanced");
          const isBeginner = user.email.includes("beginner");

          // Determine completion status based on user type and module index
          const shouldComplete = isAdvanced
            ? index < 2
            : isBeginner
            ? index < 1
            : index === 0;

          return {
            moduleIndex: index,
            completed: shouldComplete,
            locked: index === 0 ? false : !shouldComplete,
            resources: module.resources.map((resource, resIndex) => ({
              resourceId: resource._id
                ? resource._id.toString()
                : `resource_${index}_${resIndex}`,
              completed: shouldComplete || (index === 1 && resIndex < 2),
              completedAt: shouldComplete
                ? new Date(Date.now() - (30 - index) * 24 * 60 * 60 * 1000)
                : null,
              type: resource.type || "article",
            })),
            quiz: {
              completed: shouldComplete,
              score: shouldComplete
                ? Math.floor(Math.random() * 30) + 70
                : null,
              completedAt: shouldComplete
                ? new Date(Date.now() - (28 - index) * 24 * 60 * 60 * 1000)
                : null,
            },
          };
        });

        // Calculate progress
        const completedModules = moduleProgress.filter(m => m.completed).length;
        const progress = Math.round(
          (completedModules / moduleProgress.length) * 100
        );

        // Create pathway
        const pathway = new Pathway({
          userId: user._id,
          goalId: goal._id,
          status: progress === 100 ? "completed" : "active",
          progress,
          currentModule: Math.min(completedModules, moduleProgress.length - 1),
          moduleProgress,
          startedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          lastAccessedAt: new Date(
            Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
          ),
          estimatedCompletionDate: new Date(
            Date.now() + ((100 - progress) * 24 * 60 * 60 * 1000) / 10
          ),
          adaptiveRecommendations: [
            {
              type: "practice",
              description: "Pratiquez les exercices du module en cours",
              priority: "high",
              status: "pending",
            },
            {
              type: "review",
              description: "Révisez les concepts précédents",
              priority: "medium",
              status: "pending",
            },
          ],
        });

        await pathway.save();
        logger.info(`Created pathway for user ${user.email}: ${goal.title}`);
      }
    }

    logger.info("Demo data population completed successfully!");
  } catch (error) {
    logger.error("Error populating demo data:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Run the function
populateDemoData();
