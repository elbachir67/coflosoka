/**
 * Script to fix quiz questions by ensuring the first answer is not always correct
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
    logger.info("Connecting to MongoDB to fix quiz questions...");
    await mongoose.connect(MONGODB_URI);
    logger.info("MongoDB Connected: " + mongoose.connection.host);
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

async function fixQuizQuestions() {
  try {
    await connectDB();

    // Import all models to ensure they are registered
    await import("../models/index.js");

    // Get the Quiz model
    const Quiz = mongoose.model("Quiz");

    logger.info("Fixing quiz questions to randomize correct answers...");

    // Get all quizzes
    const quizzes = await Quiz.find();
    logger.info(`Found ${quizzes.length} quizzes to process`);

    let updatedCount = 0;

    for (const quiz of quizzes) {
      let quizModified = false;

      // Process each question in the quiz
      quiz.questions = quiz.questions.map(question => {
        // Check if the first option is correct
        if (question.options[0].isCorrect) {
          // Randomly decide whether to shuffle the options
          if (Math.random() > 0.5) {
            // Shuffle the options
            const shuffledOptions = [...question.options].sort(
              () => Math.random() - 0.5
            );
            quizModified = true;
            return {
              ...question,
              options: shuffledOptions,
            };
          }
        }
        return question;
      });

      if (quizModified) {
        await quiz.save();
        updatedCount++;
      }
    }

    logger.info(
      `Successfully updated ${updatedCount} quizzes with randomized correct answers`
    );
  } catch (error) {
    logger.error("Error fixing quiz questions:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Run the function
fixQuizQuestions();
