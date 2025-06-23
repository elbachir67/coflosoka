import express from "express";
import { auth } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";
import fetch from "node-fetch";

const router = express.Router();

// Route pour l'API OpenAI
router.post("/openai", auth, async (req, res) => {
  try {
    const { prompt, model = "gpt-3.5-turbo", maxTokens = 500 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Le prompt est requis" });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "Clé API OpenAI non configurée" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error("OpenAI API error:", error);
      return res
        .status(response.status)
        .json({ error: "Erreur lors de la requête à OpenAI" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    logger.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Erreur lors de l'appel à l'API OpenAI" });
  }
});

// Route pour l'API Hugging Face
router.post("/huggingface", auth, async (req, res) => {
  try {
    const { inputs, model = "gpt2" } = req.body;

    if (!inputs) {
      return res.status(400).json({ error: "Les inputs sont requis" });
    }

    const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
    if (!HUGGINGFACE_API_KEY) {
      return res
        .status(500)
        .json({ error: "Clé API Hugging Face non configurée" });
    }

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        },
        body: JSON.stringify({ inputs }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      logger.error("Hugging Face API error:", error);
      return res
        .status(response.status)
        .json({ error: "Erreur lors de la requête à Hugging Face" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    logger.error("Error calling Hugging Face API:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'appel à l'API Hugging Face" });
  }
});

// Route pour l'API Kaggle
router.get("/kaggle/datasets", auth, async (req, res) => {
  try {
    const { query, page = 1, pageSize = 10 } = req.query;

    const KAGGLE_USERNAME = process.env.KAGGLE_USERNAME;
    const KAGGLE_KEY = process.env.KAGGLE_KEY;

    if (!KAGGLE_USERNAME || !KAGGLE_KEY) {
      return res
        .status(500)
        .json({ error: "Identifiants Kaggle non configurés" });
    }

    // Encodage en base64 des identifiants Kaggle
    const credentials = Buffer.from(
      `${KAGGLE_USERNAME}:${KAGGLE_KEY}`
    ).toString("base64");

    const response = await fetch(
      `https://www.kaggle.com/api/v1/datasets/list?search=${query}&page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      logger.error("Kaggle API error:", error);
      return res
        .status(response.status)
        .json({ error: "Erreur lors de la requête à Kaggle" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    logger.error("Error calling Kaggle API:", error);
    res.status(500).json({ error: "Erreur lors de l'appel à l'API Kaggle" });
  }
});

// Route pour l'API News
router.get("/news", auth, async (req, res) => {
  try {
    const { query = "artificial intelligence", pageSize = 10 } = req.query;

    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    if (!NEWS_API_KEY) {
      return res.status(500).json({ error: "Clé API News non configurée" });
    }

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&pageSize=${pageSize}&language=fr&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      const error = await response.json();
      logger.error("News API error:", error);
      return res
        .status(response.status)
        .json({ error: "Erreur lors de la requête à News API" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    logger.error("Error calling News API:", error);
    res.status(500).json({ error: "Erreur lors de l'appel à l'API News" });
  }
});

// Route pour l'API OpenWeather
router.get("/weather", auth, async (req, res) => {
  try {
    const { city = "Dakar" } = req.query;

    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!OPENWEATHER_API_KEY) {
      return res
        .status(500)
        .json({ error: "Clé API OpenWeather non configurée" });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );

    if (!response.ok) {
      const error = await response.json();
      logger.error("OpenWeather API error:", error);
      return res
        .status(response.status)
        .json({ error: "Erreur lors de la requête à OpenWeather" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    logger.error("Error calling OpenWeather API:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'appel à l'API OpenWeather" });
  }
});

export default router;
