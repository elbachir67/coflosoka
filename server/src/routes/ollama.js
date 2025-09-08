import express from "express";
const router = express.Router();

router.get("/health", async (req, res) => {
  try {
    const response = await fetch("http://nieup-ollama:11434");
    res.json({ status: "healthy" });
  } catch (error) {
    res.json({ status: "unavailable" });
  }
});

router.get("/models", async (req, res) => {
  try {
    const response = await fetch("http://nieup-ollama:11434/api/tags");
    const data = await response.json();
    res.json(data.models || []);
  } catch (error) {
    res.json([]);
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { messages, model = "mistral" } = req.body;
    const prompt = messages.map(m => m.role + ": " + m.content).join("\n");
    
    const response = await fetch("http://nieup-ollama:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false
      })
    });
    
    const data = await response.json();
    res.json({ message: data.response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const ollamaRoutes = router;
