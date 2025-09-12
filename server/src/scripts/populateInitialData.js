/**
 * Script to populate the database with initial data
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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

async function populateInitialData() {
  try {
    await connectDB();

    // Import all models to ensure they are registered
    const { User, Goal, Assessment, Quiz, LearnerProfile } = await import(
      "../models/index.js"
    );

    logger.info("Starting initial data population...");

    // Create admin and test users
    const users = [
      {
        email: "admin@ucad.edu.sn",
        password: "Admin123!",
        role: "admin",
        isActive: true,
      },
      {
        email: "student@ucad.edu.sn",
        password: "Student123!",
        role: "user",
        isActive: true,
      },
      {
        email: "student1@ucad.edu.sn",
        password: "Student123!",
        role: "user",
        isActive: true,
      },
      {
        email: "student2@ucad.edu.sn",
        password: "Student123!",
        role: "user",
        isActive: true,
      },
    ];

    // Check if users already exist
    const existingUserCount = await User.countDocuments();

    if (existingUserCount === 0) {
      for (const userData of users) {
        const user = new User(userData);
        await user.save();
        logger.info(`Created user: ${userData.email}`);
      }
    } else {
      logger.info(
        `${existingUserCount} users already exist, skipping user creation`
      );
    }

    // Create learner profiles for test users
    const testUsers = await User.find({ role: "user" });

    for (const user of testUsers) {
      const existingProfile = await LearnerProfile.findOne({
        userId: user._id,
      });

      if (!existingProfile) {
        // Create a profile with valid enum values
        const profile = new LearnerProfile({
          userId: user._id,
          learningStyle: "visual",
          preferences: {
            mathLevel: "intermediate",
            programmingLevel: "intermediate",
            preferredDomain: "ml", // Using a valid enum value
          },
          assessments: [],
        });

        await profile.save();
        logger.info(`Created learner profile for: ${user.email}`);
      }
    }

    // Import assessment questions data
    const { ASSESSMENT_QUESTIONS } = await import(
      "../data/assessmentQuestions.js"
    );

    // Create assessments
    const assessmentCategories = Object.keys(ASSESSMENT_QUESTIONS);

    for (const category of assessmentCategories) {
      const existingAssessment = await Assessment.findOne({ category });

      if (!existingAssessment) {
        const assessment = new Assessment({
          title: `${category.toUpperCase()} Assessment`,
          category,
          difficulty: "intermediate",
          questions: ASSESSMENT_QUESTIONS[category],
        });

        await assessment.save();
        logger.info(`Created assessment for category: ${category}`);
      }
    }

    // Import quiz questions data
    const { QUIZ_QUESTIONS } = await import("../data/quizQuestion.js");

    // Create sample goals if none exist
    const existingGoalCount = await Goal.countDocuments();

    if (existingGoalCount === 0) {
      // Create basic goals
      const goals = [
        {
          title: "Fondamentaux du Machine Learning",
          description:
            "Maîtrisez les concepts de base du machine learning avec une approche pratique et théorique solide.",
          category: "ml",
          level: "beginner",
          estimatedDuration: 8,
          prerequisites: [
            {
              category: "math",
              skills: [
                { name: "Algèbre linéaire", level: "basic" },
                { name: "Statistiques", level: "basic" },
              ],
            },
            {
              category: "programming",
              skills: [{ name: "Python", level: "basic" }],
            },
          ],
          modules: [
            {
              title: "Introduction au Machine Learning",
              description:
                "Découvrez les concepts fondamentaux et les types d'apprentissage automatique",
              duration: 15,
              skills: [
                { name: "Concepts ML", level: "basic" },
                { name: "Types d'apprentissage", level: "basic" },
              ],
              resources: [
                {
                  title: "Introduction to Machine Learning",
                  url: "https://www.coursera.org/learn/machine-learning",
                  type: "course",
                  duration: 180,
                },
                {
                  title: "Machine Learning Basics",
                  url: "https://towardsdatascience.com/machine-learning-basics",
                  type: "article",
                  duration: 45,
                },
              ],
              validationCriteria: [
                "Comprendre les différents types d'apprentissage",
                "Identifier les cas d'usage appropriés",
              ],
            },
          ],
          careerOpportunities: [
            {
              title: "Data Scientist Junior",
              description:
                "Analyste de données avec focus sur le machine learning",
              averageSalary: "45-65k€/an",
              companies: ["Orange", "Sonatel", "Expresso", "Startups Tech"],
            },
          ],
        },
        {
          title: "Deep Learning Avancé",
          description:
            "Plongez dans les architectures de réseaux de neurones profonds et leurs applications modernes.",
          category: "dl",
          level: "advanced",
          estimatedDuration: 16,
          prerequisites: [
            {
              category: "math",
              skills: [
                { name: "Calcul différentiel", level: "intermediate" },
                { name: "Algèbre linéaire", level: "advanced" },
              ],
            },
            {
              category: "programming",
              skills: [
                { name: "Python", level: "advanced" },
                { name: "TensorFlow/PyTorch", level: "intermediate" },
              ],
            },
          ],
          modules: [
            {
              title: "Architectures de Réseaux de Neurones",
              description:
                "Comprenez les différentes architectures et leur utilisation",
              duration: 30,
              skills: [
                { name: "CNN", level: "advanced" },
                { name: "RNN", level: "advanced" },
                { name: "Transformers", level: "intermediate" },
              ],
              resources: [
                {
                  title: "Deep Learning Specialization",
                  url: "https://www.coursera.org/specializations/deep-learning",
                  type: "course",
                  duration: 300,
                },
              ],
              validationCriteria: [
                "Implémenter un CNN from scratch",
                "Comprendre la rétropropagation",
              ],
            },
          ],
        },
      ];

      for (const goalData of goals) {
        const goal = new Goal(goalData);
        await goal.save();
        logger.info(`Created goal: ${goalData.title}`);

        // Create quizzes for each module
        for (let i = 0; i < goal.modules.length; i++) {
          const module = goal.modules[i];

          // Select questions based on the goal category
          let questionPool = [];

          switch (goal.category) {
            case "ml":
              questionPool = QUIZ_QUESTIONS.fundamentals.concat(
                QUIZ_QUESTIONS.classification
              );
              break;
            case "dl":
              questionPool = QUIZ_QUESTIONS.fundamentals.concat(
                QUIZ_QUESTIONS.deep_learning
              );
              break;
            default:
              questionPool = QUIZ_QUESTIONS.fundamentals;
          }

          // Shuffle and select 10 questions
          const shuffled = questionPool.sort(() => 0.5 - Math.random());
          const selectedQuestions = shuffled.slice(0, 10);

          // Randomize which answer is correct for each question
          const randomizedQuestions = selectedQuestions.map(q => {
            // Randomly shuffle the options
            const shuffledOptions = [...q.options].sort(
              () => 0.5 - Math.random()
            );
            return {
              ...q,
              options: shuffledOptions,
            };
          });

          const quiz = new Quiz({
            moduleId: module._id.toString(),
            title: `Quiz - ${module.title}`,
            description: `Évaluez vos connaissances sur ${module.title}`,
            timeLimit: 1800, // 30 minutes
            passingScore: 70,
            questions: randomizedQuestions,
          });

          await quiz.save();
          logger.info(`Created quiz for module: ${module.title}`);
        }
      }
    } else {
      logger.info(
        `${existingGoalCount} goals already exist, skipping goal creation`
      );
    }

    logger.info("Initial data population completed successfully!");
  } catch (error) {
    logger.error("Error populating demo data:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Run the function
populateInitialData();
