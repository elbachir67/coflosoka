import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Ensure we have a MongoDB URI
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

/**
 * Export the database to JSON files
 */
async function exportDatabase() {
  try {
    logger.info("Connecting to MongoDB to export database...");
    await mongoose.connect(MONGODB_URI);
    logger.info(`MongoDB Connected: ${mongoose.connection.host}`);

    // Create exports directory if it doesn't exist
    const exportsDir = path.join(__dirname, "../../exports");
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Get all collections
    const collections = await mongoose.connection.db.collections();
    logger.info(`Found ${collections.length} collections to export`);

    // Export each collection to a JSON file
    for (const collection of collections) {
      if (!collection.collectionName.startsWith("system.")) {
        const documents = await collection.find({}).toArray();

        // Convert ObjectId to string for proper JSON serialization
        const serializedDocs = documents.map(doc => {
          const serialized = { ...doc };
          if (serialized._id) {
            serialized._id = serialized._id.toString();
          }
          return serialized;
        });

        const filePath = path.join(
          exportsDir,
          `${collection.collectionName}.json`
        );
        fs.writeFileSync(filePath, JSON.stringify(serializedDocs, null, 2));

        logger.info(
          `Exported ${documents.length} documents from ${collection.collectionName}`
        );
      }
    }

    logger.info(
      `Database export completed successfully! Files saved to ${exportsDir}`
    );
  } catch (error) {
    logger.error("Error exporting database:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

/**
 * Import the database from JSON files
 */
async function importDatabase() {
  try {
    logger.info("Connecting to MongoDB to import database...");
    await mongoose.connect(MONGODB_URI);
    logger.info(`MongoDB Connected: ${mongoose.connection.host}`);

    // Check if exports directory exists
    const exportsDir = path.join(__dirname, "../../exports");
    if (!fs.existsSync(exportsDir)) {
      throw new Error("Exports directory not found. Run export first.");
    }

    // Get all JSON files in the exports directory
    const files = fs
      .readdirSync(exportsDir)
      .filter(file => file.endsWith(".json"));
    logger.info(`Found ${files.length} JSON files to import`);

    // Import each file to its corresponding collection
    for (const file of files) {
      const collectionName = path.basename(file, ".json");
      const filePath = path.join(exportsDir, file);

      // Read and parse the JSON file
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

      // Drop the existing collection if it exists
      try {
        await mongoose.connection.db.collection(collectionName).drop();
        logger.info(`Dropped existing collection: ${collectionName}`);
      } catch (error) {
        // Collection might not exist, which is fine
        logger.info(
          `Collection ${collectionName} does not exist or could not be dropped`
        );
      }

      // Insert the documents
      if (data.length > 0) {
        await mongoose.connection.db
          .collection(collectionName)
          .insertMany(data);
        logger.info(`Imported ${data.length} documents to ${collectionName}`);
      } else {
        logger.info(`No documents to import for ${collectionName}`);
      }
    }

    logger.info("Database import completed successfully!");
  } catch (error) {
    logger.error("Error importing database:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Execute the function based on command line argument
const action = process.argv[2] || "export";

if (action === "export") {
  exportDatabase();
} else if (action === "import") {
  importDatabase();
} else {
  logger.error("Invalid action. Use 'export' or 'import'");
  process.exit(1);
}
