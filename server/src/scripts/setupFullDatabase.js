import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";

// Convert exec to promise-based
const execPromise = promisify(exec);

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Ensure we have a MongoDB URI
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

/**
 * Run a script and log its output
 */
async function runScript(scriptPath) {
  try {
    logger.info(`Running script: ${scriptPath}`);
    const { stdout, stderr } = await execPromise(`node ${scriptPath}`);

    if (stdout) {
      logger.info(`Script output: ${stdout}`);
    }

    if (stderr) {
      logger.error(`Script error: ${stderr}`);
    }

    return true;
  } catch (error) {
    logger.error(`Error running script ${scriptPath}:`, error);
    return false;
  }
}

/**
 * Setup the full database by running all population scripts in sequence
 */
async function setupFullDatabase() {
  try {
    logger.info("Starting full database setup...");

    // Step 1: Reset the database
    const resetPath = path.join(__dirname, "resetDatabase.js");
    const resetSuccess = await runScript(resetPath);

    if (!resetSuccess) {
      throw new Error("Failed to reset database");
    }

    // Step 2: Populate initial data (goals, assessments, etc.)
    const initialDataPath = path.join(__dirname, "populateInitialData.js");
    const initialDataSuccess = await runScript(initialDataPath);

    if (!initialDataSuccess) {
      throw new Error("Failed to populate initial data");
    }

    // Step 3: Populate achievements
    const achievementsPath = path.join(__dirname, "populateAchievements.js");
    const achievementsSuccess = await runScript(achievementsPath);

    if (!achievementsSuccess) {
      throw new Error("Failed to populate achievements");
    }

    // Step 4: Populate demo data (users, profiles, pathways)
    const demoDataPath = path.join(__dirname, "populateDemoData.js");
    const demoDataSuccess = await runScript(demoDataPath);

    if (!demoDataSuccess) {
      throw new Error("Failed to populate demo data");
    }

    // Step 5: Fix quiz questions
    const fixQuizPath = path.join(__dirname, "fixQuizQuestions.js");
    const fixQuizSuccess = await runScript(fixQuizPath);

    if (!fixQuizSuccess) {
      throw new Error("Failed to fix quiz questions");
    }

    logger.info("\n=== 🚀 FULL DATABASE SETUP COMPLETED SUCCESSFULLY ===");
    logger.info(
      "The database has been reset and populated with all necessary data."
    );
    logger.info(
      "You can now start using the application with the demo accounts:"
    );
    logger.info("- Student: student@ucad.edu.sn / Student123!");
    logger.info("- Admin: admin@ucad.edu.sn / Admin123!");
    logger.info("- Advanced user: advanced@ucad.edu.sn / Advanced123!");
    logger.info("- Beginner user: beginner@ucad.edu.sn / Beginner123!");
  } catch (error) {
    logger.error("Error during full database setup:", error);
  }
}

// Execute the setup function
setupFullDatabase();
