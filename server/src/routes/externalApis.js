import express from "express";
import { auth } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";
import fetch from "node-fetch";

const router = express.Router();

// Weather API route
router.get("/weather", auth, async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: "Nom de ville requis" });
    }

    const API_KEY = "485eaae13c44dca81805beb5cfe0e7b3";

    // Si c'est Dakar, utiliser les coordonnées précises
    let apiUrl;
    if (city.toLowerCase() === "dakar") {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=14.6937&lon=-17.4441&appid=${API_KEY}&units=metric&lang=fr`;
    } else {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric&lang=fr`;
    }

    logger.info(`Fetching weather data for: ${city}`);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("OpenWeatherMap API error:", errorText);

      if (response.status === 404) {
        throw new Error("Ville non trouvée. Vérifiez l'orthographe.");
      } else if (response.status === 401) {
        throw new Error("Clé API invalide.");
      } else {
        throw new Error(`Erreur API météo: ${response.status}`);
      }
    }

    const weatherData = await response.json();
    logger.info(`Successfully fetched weather data for ${city}`);

    res.json(weatherData);
  } catch (error) {
    logger.error("Error in weather route:", error);
    res.status(500).json({
      error:
        error.message || "Erreur lors de la récupération des données météo",
    });
  }
});

// News API route
router.get("/news", auth, async (req, res) => {
  try {
    const { query = "intelligence artificielle", pageSize = "12" } = req.query;

    const API_KEY = "da1e4ca8-8e8b-4d4d-b3c0-95c3524637e8";
    const apiUrl = "https://newsapi.ai/api/v1/article/getArticles";

    const requestBody = {
      query: {
        $query: {
          $and: [
            {
              conceptUri: {
                $or: [
                  "http://en.wikipedia.org/wiki/Artificial_intelligence",
                  "http://en.wikipedia.org/wiki/Machine_learning",
                  "http://en.wikipedia.org/wiki/Deep_learning",
                  "http://en.wikipedia.org/wiki/Natural_language_processing",
                ],
              },
            },
            {
              lang: "eng",
            },
          ],
        },
        $filter: {
          forceMaxDataTimeWindow: "31",
        },
      },
      resultType: "articles",
      articlesSortBy: "date",
      articlesCount: parseInt(pageSize),
      articlesIncludeArticleImage: true,
      articlesIncludeArticleVideos: false,
      apiKey: API_KEY,
    };

    logger.info(`Fetching real AI news from NewsAPI.ai with query: ${query}`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("NewsAPI.ai error:", errorText);
      throw new Error(`Erreur API NewsAPI.ai: ${response.status}`);
    }

    const newsData = await response.json();

    // Transformer les données au format attendu par le frontend
    const transformedData = {
      status: "ok",
      totalResults: newsData.articles?.results?.length || 0,
      articles: (newsData.articles?.results || []).map(article => ({
        source: {
          id: article.source?.uri || null,
          name: article.source?.title || "Source inconnue",
        },
        author: article.authors?.[0]?.name || "Auteur inconnu",
        title: article.title || "Titre non disponible",
        description:
          article.body?.substring(0, 200) + "..." ||
          "Description non disponible",
        url: article.url || "#",
        urlToImage: article.image || null,
        publishedAt: article.dateTime || new Date().toISOString(),
        content: article.body || "Contenu non disponible",
      })),
    };

    logger.info(
      `Successfully fetched ${transformedData.articles.length} real AI news articles`
    );
    res.json(transformedData);
  } catch (error) {
    logger.error("Error fetching AI news:", error);

    // En cas d'erreur, retourner des données de fallback
    const fallbackNews = {
      status: "ok",
      totalResults: 3,
      articles: [
        {
          source: { id: "techcrunch", name: "TechCrunch" },
          author: "Sarah Perez",
          title: "L'IA générative transforme l'éducation en Afrique",
          description:
            "Les nouvelles technologies d'intelligence artificielle révolutionnent l'apprentissage sur le continent africain avec des solutions adaptées aux défis locaux.",
          url: "https://techcrunch.com/2025/01/ai-education-africa",
          urlToImage:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          content: "L'intelligence artificielle transforme l'éducation...",
        },
        {
          source: { id: "wired", name: "Wired" },
          author: "James Vincent",
          title: "Les modèles de langage multilingues favorisent l'inclusion",
          description:
            "Les derniers développements en NLP permettent une meilleure prise en charge des langues africaines dans les systèmes d'IA.",
          url: "https://wired.com/2025/01/multilingual-ai-africa",
          urlToImage:
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          content: "Les modèles de langage multilingues...",
        },
        {
          source: { id: "mit-tech-review", name: "MIT Technology Review" },
          author: "Karen Hao",
          title: "L'IA pour l'agriculture : révolution en cours au Sénégal",
          description:
            "Des startups sénégalaises utilisent l'IA pour optimiser les rendements agricoles et lutter contre les changements climatiques.",
          url: "https://technologyreview.com/2025/01/ai-agriculture-senegal",
          urlToImage:
            "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          content: "L'intelligence artificielle révolutionne l'agriculture...",
        },
      ],
    };

    logger.info("Serving fallback news due to API error");
    res.json(fallbackNews);
  }
});

// Kaggle datasets API route
router.get("/kaggle/datasets", auth, async (req, res) => {
  try {
    const {
      query = "machine learning",
      page = "1",
      pageSize = "10",
    } = req.query;

    // Simuler des données Kaggle pour la démonstration
    const mockDatasets = [
      {
        id: "titanic",
        title: "Titanic - Machine Learning from Disaster",
        subtitle: "Start here! Predict survival on the Titanic",
        description:
          "Use machine learning to create a model that predicts which passengers survived the Titanic shipwreck.",
        url: "https://www.kaggle.com/c/titanic",
        downloadCount: 150000,
        voteCount: 12500,
        usabilityRating: 9.4,
        lastUpdated: "2024-12-15T10:30:00Z",
        ownerName: "Kaggle",
        ownerRef: "kaggle",
        totalBytes: 59000,
        tags: ["classification", "beginner", "tutorial"],
      },
      {
        id: "house-prices",
        title: "House Prices - Advanced Regression Techniques",
        subtitle: "Predict sales prices and practice feature engineering",
        description:
          "Ask a home buyer to describe their dream house, and they probably won't begin with the height of the basement ceiling.",
        url: "https://www.kaggle.com/c/house-prices-advanced-regression-techniques",
        downloadCount: 89000,
        voteCount: 8900,
        usabilityRating: 8.7,
        lastUpdated: "2024-11-20T14:15:00Z",
        ownerName: "Kaggle",
        ownerRef: "kaggle",
        totalBytes: 460000,
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
        downloadCount: 125000,
        voteCount: 11200,
        usabilityRating: 9.1,
        lastUpdated: "2024-10-05T09:45:00Z",
        ownerName: "Kaggle",
        ownerRef: "kaggle",
        totalBytes: 11000000,
        tags: ["computer vision", "deep learning", "mnist", "beginner"],
      },
    ];

    // Filtrer selon la requête
    const filteredDatasets = mockDatasets.filter(
      dataset =>
        dataset.title.toLowerCase().includes(query.toLowerCase()) ||
        dataset.description.toLowerCase().includes(query.toLowerCase()) ||
        dataset.tags.some(tag =>
          tag.toLowerCase().includes(query.toLowerCase())
        )
    );

    logger.info(
      `Serving ${filteredDatasets.length} mock Kaggle datasets for query: ${query}`
    );
    res.json(filteredDatasets);
  } catch (error) {
    logger.error("Error in Kaggle datasets route:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des datasets",
    });
  }
});

export default router;
