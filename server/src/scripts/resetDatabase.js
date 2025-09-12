/**
 * Script to reset the database by removing all collections and then repopulating with initial data
 */

import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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

async function resetDatabase() {
  try {
    await connectDB();

    logger.info("Starting database reset...");

    // Get all collections
    const collections = await mongoose.connection.db.collections();

    // Drop all collections except system collections
    for (const collection of collections) {
      if (!collection.collectionName.startsWith("system.")) {
        await collection.drop();
        logger.info(`Dropped collection: ${collection.collectionName}`);
      }
    }

    logger.info("All collections dropped successfully");

    // Run the population scripts in sequence
    logger.info("Starting data repopulation...");

    // Run populateInitialData.js
    logger.info("Running populateInitialData.js...");
    await execAsync(`node ${path.join(__dirname, "populateInitialData.js")}`);

    // Run populateAchievements.js
    logger.info("Running populateAchievements.js...");
    await execAsync(`node ${path.join(__dirname, "populateAchievements.js")}`);

    // Run populateCollaborativeData.js
    logger.info("Running populateCollaborativeData.js...");
    await execAsync(
      `node ${path.join(__dirname, "populateCollaborativeData.js")}`
    );

    // Run populateExtensiveData.js
    logger.info("Running populateExtensiveData.js...");
    await execAsync(`node ${path.join(__dirname, "populateExtensiveData.js")}`);

    logger.info("Database reset and repopulation completed successfully!");
  } catch (error) {
    logger.error("Error resetting database:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Run the function
resetDatabase();
