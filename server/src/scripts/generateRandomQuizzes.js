import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { ASSESSMENT_QUESTIONS } from "../data/assessmentQuestions.js";
import { QUIZ_QUESTIONS } from "../data/quizQuestion.js";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Ensure we have a MongoDB URI
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

/**
 * Generate random quiz questions for all modules in all goals
 */
async function generateRandomQuizzes() {
  try {
    logger.info("Connecting to MongoDB to generate random quizzes...");
    await mongoose.connect(MONGODB_URI);
    logger.info(`MongoDB Connected: ${mongoose.connection.host}`);

    // Import the Goal and Quiz models
    const Goal = mongoose.model("Goal");
    const Quiz = mongoose.model("Quiz");

    // Get all goals
    const goals = await Goal.find();
    logger.info(`Found ${goals.length} goals`);

    // Combine all question categories for a larger pool
    const allQuestions = [
      ...ASSESSMENT_QUESTIONS.math,
      ...ASSESSMENT_QUESTIONS.programming,
      ...ASSESSMENT_QUESTIONS.ml,
      ...ASSESSMENT_QUESTIONS.dl,
      ...ASSESSMENT_QUESTIONS.computer_vision,
      ...ASSESSMENT_QUESTIONS.nlp,
      ...QUIZ_QUESTIONS.fundamentals,
      ...QUIZ_QUESTIONS.classification,
      ...QUIZ_QUESTIONS.deep_learning,
    ];

    // Process each goal
    for (const goal of goals) {
      logger.info(`Processing goal: ${goal.title}`);

      // Process each module in the goal
      for (
        let moduleIndex = 0;
        moduleIndex < goal.modules.length;
        moduleIndex++
      ) {
        const module = goal.modules[moduleIndex];

        // Check if a quiz already exists for this module
        const existingQuiz = await Quiz.findOne({
          moduleId: module._id.toString(),
        });

        if (existingQuiz) {
          logger.info(
            `Quiz already exists for module: ${module.title}, updating...`
          );

          // Shuffle all questions and select 10
          const shuffledQuestions = [...allQuestions].sort(
            () => Math.random() - 0.5
          );
          const selectedQuestions = shuffledQuestions.slice(0, 10);

          // Prepare questions with randomized options
          const formattedQuestions = selectedQuestions.map(question => {
            // Shuffle the options
            const shuffledOptions = [...question.options].sort(
              () => Math.random() - 0.5
            );

            return {
              text: question.text,
              options: shuffledOptions,
              explanation: question.explanation,
            };
          });

          // Update the quiz
          existingQuiz.questions = formattedQuestions;
          await existingQuiz.save();

          logger.info(
            `Updated quiz for module: ${module.title} with ${formattedQuestions.length} questions`
          );
        } else {
          logger.info(`Creating new quiz for module: ${module.title}`);

          // Shuffle all questions and select 10
          const shuffledQuestions = [...allQuestions].sort(
            () => Math.random() - 0.5
          );
          const selectedQuestions = shuffledQuestions.slice(0, 10);

          // Prepare questions with randomized options
          const formattedQuestions = selectedQuestions.map(question => {
            // Shuffle the options
            const shuffledOptions = [...question.options].sort(
              () => Math.random() - 0.5
            );

            return {
              text: question.text,
              options: shuffledOptions,
              explanation: question.explanation,
            };
          });

          // Create a new quiz
          const newQuiz = new Quiz({
            moduleId: module._id.toString(),
            title: `Quiz - ${module.title}`,
            description: `Évaluez vos connaissances sur ${module.title}`,
            timeLimit: 1800, // 30 minutes
            passingScore: 70,
            questions: formattedQuestions,
          });

          await newQuiz.save();

          logger.info(
            `Created new quiz for module: ${module.title} with ${formattedQuestions.length} questions`
          );
        }
      }
    }

    logger.info("Successfully generated random quizzes for all modules");
  } catch (error) {
    logger.error("Error generating random quizzes:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Execute the function
generateRandomQuizzes();
