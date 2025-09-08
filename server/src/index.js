import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";
import connectDB from "./config/database.js";

// Import routes
import { authRoutes } from "./routes/auth.js";
import { goalRoutes } from "./routes/goals.js";
import { conceptRoutes } from "./routes/concepts.js";
import assessmentRoutes from "./routes/assessments.js";
import { userRoutes } from "./routes/users.js";
import learnerProfileRoutes from "./routes/learnerProfiles.js";
import { pathwayRoutes } from "./routes/pathways.js";
import { quizRoutes } from "./routes/quiz.js";
import { aiRoutes } from "./routes/ai.js";
import { adminRoutes } from "./routes/admin.js";
import { collaborationRoutes } from "./routes/collaboration.js";
import { gamificationRoutes } from "./routes/gamification.js";
import analyticsRoutes from "./routes/analytics.js";
import externalApisRoutes from "./routes/externalApis.js";
import { ollamaRoutes } from "./routes/ollama.js";
import { searchRoutes } from "./routes/search.js";

import { config } from "./config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - ACCEPTER TOUT
app.use(cors({
  origin: true, // Accepte toutes les origines
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Options preflight
app.options('*', cors());

app.use(express.json());
app.use(morgan("dev"));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/concepts", conceptRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", learnerProfileRoutes);
app.use("/api/pathways", pathwayRoutes);
app.use("/api", quizRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/collaboration", collaborationRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/external", externalApisRoutes);
app.use("/api/ollama", ollamaRoutes);
app.use("/api/search", searchRoutes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`CORS enabled for all origins`);
    });
  } catch (error) {
    logger.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();

export default app;

// Route publique pour tester Ollama
app.get("/api/public/ollama-test", async (req, res) => {
  try {
    const response = await fetch("http://localhost:11434");
    const text = await response.text();
    
    const modelsResponse = await fetch("http://localhost:11434/api/tags");
    const models = await modelsResponse.json();
    
    res.json({
      status: "OK",
      ollamaResponse: text,
      models: models.models || [],
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      error: error.message,
      ollama_url: process.env.OLLAMA_URL
    });
  }
});
