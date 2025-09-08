import express from "express";
import { exec } from "child_process";
import { promisify } from "util";

const router = express.Router();
const execAsync = promisify(exec);

// Lister les modèles disponibles
router.get("/api/ollama/models", async (req, res) => {
  try {
    const response = await fetch("http://ollama:11434/api/tags");
    const data = await response.json();
    res.json({
      current: process.env.OLLAMA_DEFAULT_MODEL || "mistral",
      available: data.models || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Changer le modèle actif
router.post("/api/ollama/switch", async (req, res) => {
  const { model } = req.body;
  const validModels = ["mistral", "tinyllama", "phi", "gemma:2b"];
  
  if (!validModels.includes(model)) {
    return res.status(400).json({ error: "Invalid model" });
  }
  
  process.env.OLLAMA_DEFAULT_MODEL = model;
  res.json({ 
    success: true, 
    model: model,
    message: "Model switched successfully" 
  });
});

export default router;
