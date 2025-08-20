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

    // Simuler des datasets Kaggle pour la démonstration
    const mockDatasets = [
      {
        id: "titanic",
        title: "Titanic - Machine Learning from Disaster",
        subtitle: "Start here! Predict survival on the Titanic",
        description:
          "Use machine learning to create a model that predicts which passengers survived the Titanic shipwreck.",
        url: "https://www.kaggle.com/c/titanic",
        downloadCount: 150000,
        voteCount: 8500,
        usabilityRating: 9.2,
        lastUpdated: "2024-12-15T10:30:00Z",
        ownerName: "Kaggle",
        ownerRef: "kaggle",
        totalBytes: 102400,
        tags: ["classification", "beginner", "tutorial"],
      },
      {
        id: "house-prices",
        title: "House Prices - Advanced Regression Techniques",
        subtitle: "Predict sales prices and practice feature engineering",
        description:
          "Ask a home buyer to describe their dream house, and they probably won't begin with the height of the basement ceiling.",
        url: "https://www.kaggle.com/c/house-prices-advanced-regression-techniques",
        downloadCount: 95000,
        voteCount: 6200,
        usabilityRating: 8.8,
        lastUpdated: "2024-11-20T14:15:00Z",
        ownerName: "Kaggle",
        ownerRef: "kaggle",
        totalBytes: 460800,
        tags: ["regression", "feature engineering", "intermediate"],
      },
      {
        id: "digit-recognizer",
        title: "Digit Recognizer",
        subtitle:
          "Learn computer vision fundamentals with the famous MNIST data",
        description:
          'MNIST ("Modified National Institute of Standards and Technology") is the de facto "hello world" dataset of computer vision.',
        url: "https://www.kaggle.com/c/digit-recognizer",
        downloadCount: 120000,
        voteCount: 7800,
        usabilityRating: 9.0,
        lastUpdated: "2024-10-05T09:45:00Z",
        ownerName: "Kaggle",
        ownerRef: "kaggle",
        totalBytes: 11534336,
        tags: ["computer vision", "classification", "mnist", "beginner"],
      },
      {
        id: "nlp-disaster-tweets",
        title: "Natural Language Processing with Disaster Tweets",
        subtitle:
          "Predict which Tweets are about real disasters and which ones are not",
        description:
          "Twitter has become an important communication channel in times of emergency.",
        url: "https://www.kaggle.com/c/nlp-getting-started",
        downloadCount: 75000,
        voteCount: 4500,
        usabilityRating: 8.5,
        lastUpdated: "2024-09-12T16:20:00Z",
        ownerName: "Kaggle",
        ownerRef: "kaggle",
        totalBytes: 3145728,
        tags: ["nlp", "classification", "text analysis", "intermediate"],
      },
      {
        id: "covid19-global-forecasting",
        title: "COVID-19 Global Forecasting",
        subtitle: "Forecast COVID-19 spread with epidemiological data",
        description:
          "Help the global community better understand COVID-19 through data science.",
        url: "https://www.kaggle.com/c/covid19-global-forecasting-week-1",
        downloadCount: 45000,
        voteCount: 3200,
        usabilityRating: 7.8,
        lastUpdated: "2024-08-30T11:10:00Z",
        ownerName: "Kaggle",
        ownerRef: "kaggle",
        totalBytes: 2097152,
        tags: ["time series", "forecasting", "epidemiology", "advanced"],
      },
    ];

    // Filtrer selon la requête si fournie
    let filteredDatasets = mockDatasets;
    if (query && query !== "artificial intelligence") {
      filteredDatasets = mockDatasets.filter(
        dataset =>
          dataset.title.toLowerCase().includes(query.toLowerCase()) ||
          dataset.description.toLowerCase().includes(query.toLowerCase()) ||
          dataset.tags.some(tag =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      );
    }

    logger.info(
      `Serving ${filteredDatasets.length} mock datasets for query: ${query}`
    );
    res.json(filteredDatasets);
  } catch (error) {
    logger.error("Error calling Kaggle API:", error);
    res.status(500).json({ error: "Erreur lors de l'appel à l'API Kaggle" });
  }
});

// Route pour l'API News
router.get("/news", auth, async (req, res) => {
  try {
    const { query = "artificial intelligence", pageSize = 10 } = req.query;

    // Simuler des données d'actualités pour la démonstration
    const mockNews = {
      status: "ok",
      totalResults: 12,
      articles: [
        {
          source: { id: "techcrunch", name: "TechCrunch" },
          author: "Sarah Perez",
          title: "L'IA générative transforme l'éducation en Afrique",
          description:
            "Les nouvelles technologies d'IA permettent de personnaliser l'apprentissage pour des millions d'étudiants africains.",
          url: "https://techcrunch.com/ai-education-africa",
          urlToImage:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          content: "L'intelligence artificielle révolutionne l'éducation...",
        },
        {
          source: { id: "wired", name: "Wired" },
          author: "James Vincent",
          title: "ChatGPT et l'avenir de l'apprentissage automatique",
          description:
            "Comment les grands modèles de langage changent notre façon d'apprendre et d'enseigner l'IA.",
          url: "https://wired.com/chatgpt-machine-learning-future",
          urlToImage:
            "https://images.unsplash.com/photo-1676299081847-824916de030a?w=400",
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          content: "Les modèles de langage transforment l'éducation...",
        },
        {
          source: { id: "nature", name: "Nature" },
          author: "Dr. Amina Kone",
          title: "Recherche en IA : les universités africaines en pointe",
          description:
            "Les centres de recherche africains développent des solutions IA adaptées aux défis locaux.",
          url: "https://nature.com/ai-research-africa",
          urlToImage:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          content:
            "L'Afrique devient un acteur majeur de la recherche en IA...",
        },
        {
          source: { id: "mit-tech", name: "MIT Technology Review" },
          author: "Karen Hao",
          title: "Computer Vision : nouvelles applications en agriculture",
          description:
            "L'IA aide les agriculteurs africains à optimiser leurs rendements grâce à l'analyse d'images satellites.",
          url: "https://technologyreview.com/computer-vision-agriculture",
          urlToImage:
            "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          content: "La vision par ordinateur révolutionne l'agriculture...",
        },
        {
          source: { id: "ai-news", name: "AI News" },
          author: "Mohamed Diallo",
          title: "MLOps : déployer l'IA à grande échelle en Afrique",
          description:
            "Les défis et solutions pour déployer des modèles d'IA dans des environnements avec contraintes techniques.",
          url: "https://ai-news.com/mlops-africa-deployment",
          urlToImage:
            "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400",
          publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
          content:
            "Le déploiement d'IA en Afrique présente des défis uniques...",
        },
        {
          source: { id: "ieee", name: "IEEE Spectrum" },
          author: "Dr. Fatima Zahra",
          title: "NLP pour les langues africaines : avancées récentes",
          description:
            "Développement de modèles de traitement du langage naturel pour les langues locales africaines.",
          url: "https://spectrum.ieee.org/nlp-african-languages",
          urlToImage:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          content: "Le NLP s'adapte aux langues africaines...",
        },
      ],
    };

    logger.info(`Serving mock news data for query: ${query}`);
    res.json(mockNews);
  } catch (error) {
    logger.error("Error calling News API:", error);
    res.status(500).json({ error: "Erreur lors de l'appel à l'API News" });
  }
});

// Route pour l'API OpenWeather
router.get("/weather", auth, async (req, res) => {
  try {
    const { city = "Dakar" } = req.query;

    // Simuler des données météo pour la démonstration
    const mockWeatherData = {
      coord: { lon: -17.4441, lat: 14.6928 },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "ciel dégagé",
          icon: "01d",
        },
      ],
      base: "stations",
      main: {
        temp: 28.5,
        feels_like: 31.2,
        temp_min: 26.8,
        temp_max: 30.1,
        pressure: 1013,
        humidity: 65,
      },
      visibility: 10000,
      wind: {
        speed: 4.2,
        deg: 320,
      },
      clouds: {
        all: 5,
      },
      dt: Math.floor(Date.now() / 1000),
      sys: {
        type: 1,
        id: 1234,
        country: "SN",
        sunrise: Math.floor(Date.now() / 1000) - 3600,
        sunset: Math.floor(Date.now() / 1000) + 7200,
      },
      timezone: 0,
      id: 2253354,
      name: city,
      cod: 200,
    };

    logger.info(`Serving mock weather data for city: ${city}`);
    res.json(mockWeatherData);
  } catch (error) {
    logger.error("Error calling OpenWeather API:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'appel à l'API OpenWeather" });
  }
});

export default router;
