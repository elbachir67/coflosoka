import express from "express";
import { auth } from "../middleware/auth.js";
import { Goal } from "../models/LearningGoal.js";
import { ForumPost } from "../models/ForumPost.js";
import { SharedResource } from "../models/SharedResource.js";
import { StudyGroup } from "../models/StudyGroup.js";
import { Achievement } from "../models/Achievement.js";
import OllamaService from "../services/OllamaService.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Recherche globale intelligente
router.get("/global", auth, async (req, res) => {
  try {
    const { query, type, limit = 20 } = req.query;

    if (!query || query.trim().length < 2) {
      return res
        .status(400)
        .json({ error: "Requête de recherche trop courte" });
    }

    const searchQuery = query.trim();
    const searchLimit = Math.min(parseInt(limit), 50);

    // Recherche dans différentes collections
    const searchPromises = [];

    // Recherche dans les objectifs
    if (!type || type === "goals") {
      searchPromises.push(searchGoals(searchQuery, searchLimit));
    }

    // Recherche dans les posts du forum
    if (!type || type === "forum") {
      searchPromises.push(searchForumPosts(searchQuery, searchLimit));
    }

    // Recherche dans les ressources partagées
    if (!type || type === "resources") {
      searchPromises.push(searchSharedResources(searchQuery, searchLimit));
    }

    // Recherche dans les groupes d'étude
    if (!type || type === "groups") {
      searchPromises.push(searchStudyGroups(searchQuery, searchLimit));
    }

    // Recherche dans les achievements
    if (!type || type === "achievements") {
      searchPromises.push(searchAchievements(searchQuery, searchLimit));
    }

    const results = await Promise.all(searchPromises);

    // Combiner et trier les résultats
    const combinedResults = results
      .flat()
      .sort((a, b) => b.relevance - a.relevance);

    // Utiliser Ollama pour améliorer les résultats si disponible
    let enhancedResults = combinedResults;
    if (OllamaService.isAvailable() && combinedResults.length > 0) {
      try {
        enhancedResults = await enhanceSearchWithOllama(
          searchQuery,
          combinedResults
        );
      } catch (error) {
        logger.warn("Could not enhance search with Ollama:", error);
        // Continuer avec les résultats normaux
      }
    }

    res.json({
      query: searchQuery,
      totalResults: enhancedResults.length,
      results: enhancedResults.slice(0, searchLimit),
      categories: categorizeResults(enhancedResults),
    });
  } catch (error) {
    logger.error("Error in global search:", error);
    res.status(500).json({ error: "Erreur lors de la recherche" });
  }
});

// Recherche avec suggestions intelligentes
router.get("/suggestions", auth, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    // Générer des suggestions avec Ollama si disponible
    if (OllamaService.isAvailable()) {
      try {
        const suggestions = await generateSearchSuggestions(query.trim());
        return res.json({ suggestions });
      } catch (error) {
        logger.warn("Could not generate suggestions with Ollama:", error);
      }
    }

    // Suggestions basiques basées sur les données existantes
    const basicSuggestions = await generateBasicSuggestions(query.trim());
    res.json({ suggestions: basicSuggestions });
  } catch (error) {
    logger.error("Error generating search suggestions:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la génération de suggestions" });
  }
});

// Recherche sémantique avec Ollama
router.post("/semantic", auth, async (req, res) => {
  try {
    const { query, context } = req.body;

    if (!OllamaService.isAvailable()) {
      return res.status(503).json({
        error: "Recherche sémantique non disponible - Ollama requis",
      });
    }

    if (!query || query.trim().length < 3) {
      return res
        .status(400)
        .json({ error: "Requête trop courte pour la recherche sémantique" });
    }

    // Utiliser Ollama pour comprendre l'intention de recherche
    const searchIntent = await analyzeSearchIntent(query, context);

    // Effectuer une recherche ciblée basée sur l'intention
    const targetedResults = await performTargetedSearch(searchIntent);

    res.json({
      query,
      intent: searchIntent,
      results: targetedResults,
    });
  } catch (error) {
    logger.error("Error in semantic search:", error);
    res.status(500).json({ error: "Erreur lors de la recherche sémantique" });
  }
});

// Fonctions utilitaires de recherche

async function searchGoals(query, limit) {
  try {
    const goals = await Goal.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { "modules.title": { $regex: query, $options: "i" } },
        { "modules.description": { $regex: query, $options: "i" } },
      ],
    }).limit(limit);

    return goals.map(goal => ({
      id: goal._id,
      type: "goal",
      title: goal.title,
      description: goal.description,
      category: goal.category,
      level: goal.level,
      url: `/goals/${goal._id}`,
      relevance: calculateTextRelevance(
        query,
        goal.title + " " + goal.description
      ),
      metadata: {
        duration: goal.estimatedDuration,
        modules: goal.modules.length,
      },
    }));
  } catch (error) {
    logger.error("Error searching goals:", error);
    return [];
  }
}

async function searchForumPosts(query, limit) {
  try {
    const posts = await ForumPost.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
      isActive: true,
    })
      .populate("author", "email")
      .limit(limit);

    return posts.map(post => ({
      id: post._id,
      type: "forum",
      title: post.title,
      description: post.content.substring(0, 200) + "...",
      author: post.author?.email.split("@")[0] || "Utilisateur inconnu",
      url: `/collaboration?tab=forum&post=${post._id}`,
      relevance: calculateTextRelevance(query, post.title + " " + post.content),
      metadata: {
        likes: post.likes.length,
        comments: post.comments.length,
        tags: post.tags,
      },
    }));
  } catch (error) {
    logger.error("Error searching forum posts:", error);
    return [];
  }
}

async function searchSharedResources(query, limit) {
  try {
    const resources = await SharedResource.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
      isActive: true,
    })
      .populate("author", "email")
      .limit(limit);

    return resources.map(resource => ({
      id: resource._id,
      type: "resource",
      title: resource.title,
      description: resource.description,
      author: resource.author?.email.split("@")[0] || "Utilisateur inconnu",
      url: resource.url,
      relevance: calculateTextRelevance(
        query,
        resource.title + " " + resource.description
      ),
      metadata: {
        type: resource.type,
        likes: resource.likes.length,
        downloads: resource.downloads,
        tags: resource.tags,
      },
    }));
  } catch (error) {
    logger.error("Error searching shared resources:", error);
    return [];
  }
}

async function searchStudyGroups(query, limit) {
  try {
    const groups = await StudyGroup.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { topic: { $regex: query, $options: "i" } },
      ],
      isActive: true,
    })
      .populate("createdBy", "email")
      .populate("members", "email")
      .limit(limit);

    return groups.map(group => ({
      id: group._id,
      type: "group",
      title: group.name,
      description: group.description,
      topic: group.topic,
      url: `/collaboration?tab=groups&group=${group._id}`,
      relevance: calculateTextRelevance(
        query,
        group.name + " " + group.description
      ),
      metadata: {
        members: group.members.length,
        messages: group.messages.length,
        createdBy:
          group.createdBy?.email.split("@")[0] || "Utilisateur inconnu",
      },
    }));
  } catch (error) {
    logger.error("Error searching study groups:", error);
    return [];
  }
}

async function searchAchievements(query, limit) {
  try {
    const achievements = await Achievement.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
      isHidden: false,
    }).limit(limit);

    return achievements.map(achievement => ({
      id: achievement._id,
      type: "achievement",
      title: achievement.title,
      description: achievement.description,
      category: achievement.category,
      url: `/achievements?achievement=${achievement._id}`,
      relevance: calculateTextRelevance(
        query,
        achievement.title + " " + achievement.description
      ),
      metadata: {
        points: achievement.points,
        rarity: achievement.rarity,
        icon: achievement.icon,
      },
    }));
  } catch (error) {
    logger.error("Error searching achievements:", error);
    return [];
  }
}

// Calcul de pertinence basique
function calculateTextRelevance(query, text) {
  const queryWords = query.toLowerCase().split(/\s+/);
  const textLower = text.toLowerCase();

  let score = 0;

  queryWords.forEach(word => {
    if (textLower.includes(word)) {
      // Bonus si le mot est dans le titre (supposé être au début)
      if (textLower.indexOf(word) < 100) {
        score += 2;
      } else {
        score += 1;
      }
    }
  });

  // Bonus pour correspondance exacte
  if (textLower.includes(query.toLowerCase())) {
    score += 5;
  }

  return score;
}

// Amélioration des résultats avec Ollama
async function enhanceSearchWithOllama(query, results) {
  try {
    const prompt = `Analyse cette requête de recherche: "${query}"

Voici les résultats trouvés:
${results
  .slice(0, 10)
  .map(r => `- ${r.title}: ${r.description.substring(0, 100)}`)
  .join("\n")}

Réorganise ces résultats par ordre de pertinence pour la requête et explique brièvement pourquoi chaque résultat est pertinent. Réponds au format JSON:
{
  "reorderedResults": [
    {
      "id": "id_du_résultat",
      "relevanceScore": 0.95,
      "explanation": "Explication de la pertinence"
    }
  ],
  "searchInsight": "Insight général sur la recherche"
}`;

    const response = await OllamaService.generateResponse(prompt, {
      model: "mistral",
      temperature: 0.3,
      maxTokens: 800,
    });

    try {
      const analysis = JSON.parse(response.response);

      // Réorganiser les résultats selon l'analyse d'Ollama
      const enhancedResults = results.map(result => {
        const ollamaResult = analysis.reorderedResults.find(
          r => r.id === result.id
        );
        return {
          ...result,
          relevance: ollamaResult
            ? ollamaResult.relevanceScore * 100
            : result.relevance,
          aiExplanation: ollamaResult?.explanation,
        };
      });

      return enhancedResults.sort((a, b) => b.relevance - a.relevance);
    } catch (parseError) {
      logger.warn("Could not parse Ollama search enhancement response");
      return results;
    }
  } catch (error) {
    logger.error("Error enhancing search with Ollama:", error);
    return results;
  }
}

// Génération de suggestions avec Ollama
async function generateSearchSuggestions(query) {
  try {
    const prompt = `Pour cette requête de recherche dans une plateforme d'apprentissage IA: "${query}"

Génère 5 suggestions de recherche pertinentes qui pourraient intéresser l'utilisateur. Les suggestions doivent être liées à:
- Machine Learning
- Deep Learning  
- Computer Vision
- NLP
- Data Science
- MLOps

Format de réponse (JSON):
{
  "suggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"]
}`;

    const response = await OllamaService.generateResponse(prompt, {
      model: "mistral",
      temperature: 0.7,
      maxTokens: 300,
    });

    try {
      const parsed = JSON.parse(response.response);
      return parsed.suggestions || [];
    } catch (parseError) {
      // Fallback: extraire les suggestions du texte
      const lines = response.response.split("\n").filter(line => line.trim());
      return lines.slice(0, 5);
    }
  } catch (error) {
    logger.error("Error generating suggestions with Ollama:", error);
    return [];
  }
}

// Suggestions basiques sans IA
async function generateBasicSuggestions(query) {
  const commonTerms = [
    "machine learning",
    "deep learning",
    "neural networks",
    "computer vision",
    "nlp",
    "data science",
    "python",
    "tensorflow",
    "pytorch",
    "classification",
    "regression",
    "clustering",
  ];

  return commonTerms
    .filter(
      term =>
        term.includes(query.toLowerCase()) || query.toLowerCase().includes(term)
    )
    .slice(0, 5);
}

// Analyse de l'intention de recherche
async function analyzeSearchIntent(query, context) {
  try {
    const prompt = `Analyse l'intention de cette recherche dans une plateforme d'apprentissage IA:

Requête: "${query}"
Contexte: ${context || "Aucun contexte spécifique"}

Détermine:
1. Le type de contenu recherché (cours, exercice, concept, projet, etc.)
2. Le niveau de difficulté probable (débutant, intermédiaire, avancé)
3. Le domaine d'IA concerné (ML, DL, CV, NLP, etc.)
4. L'intention (apprendre, pratiquer, réviser, approfondir)

Réponds au format JSON:
{
  "contentType": "type_de_contenu",
  "difficulty": "niveau",
  "domain": "domaine",
  "intent": "intention",
  "keywords": ["mot-clé1", "mot-clé2"],
  "confidence": 0.85
}`;

    const response = await OllamaService.generateResponse(prompt, {
      model: "mistral",
      temperature: 0.3,
      maxTokens: 400,
    });

    try {
      return JSON.parse(response.response);
    } catch (parseError) {
      return {
        contentType: "general",
        difficulty: "intermediate",
        domain: "ml",
        intent: "learn",
        keywords: query.split(/\s+/),
        confidence: 0.5,
      };
    }
  } catch (error) {
    logger.error("Error analyzing search intent:", error);
    return null;
  }
}

// Recherche ciblée basée sur l'intention
async function performTargetedSearch(intent) {
  const results = [];

  try {
    // Recherche ciblée selon le type de contenu
    switch (intent.contentType) {
      case "course":
      case "module":
        const goals = await Goal.find({
          $or: [
            { category: intent.domain },
            { level: intent.difficulty },
            { title: { $regex: intent.keywords.join("|"), $options: "i" } },
          ],
        }).limit(10);

        results.push(
          ...goals.map(goal => ({
            id: goal._id,
            type: "goal",
            title: goal.title,
            description: goal.description,
            url: `/goals/${goal._id}`,
            relevance: 90,
          }))
        );
        break;

      case "discussion":
      case "question":
        const posts = await ForumPost.find({
          $or: [
            { title: { $regex: intent.keywords.join("|"), $options: "i" } },
            { content: { $regex: intent.keywords.join("|"), $options: "i" } },
          ],
          isActive: true,
        })
          .populate("author", "email")
          .limit(10);

        results.push(
          ...posts.map(post => ({
            id: post._id,
            type: "forum",
            title: post.title,
            description: post.content.substring(0, 200),
            url: `/collaboration?tab=forum&post=${post._id}`,
            relevance: 85,
          }))
        );
        break;

      default:
        // Recherche générale
        const generalResults = await Promise.all([
          searchGoals(intent.keywords.join(" "), 5),
          searchForumPosts(intent.keywords.join(" "), 5),
          searchSharedResources(intent.keywords.join(" "), 5),
        ]);

        results.push(...generalResults.flat());
    }

    return results.sort((a, b) => b.relevance - a.relevance);
  } catch (error) {
    logger.error("Error in targeted search:", error);
    return [];
  }
}

// Catégorisation des résultats
function categorizeResults(results) {
  const categories = {};

  results.forEach(result => {
    if (!categories[result.type]) {
      categories[result.type] = 0;
    }
    categories[result.type]++;
  });

  return categories;
}

export const searchRoutes = router;
