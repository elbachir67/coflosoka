import fetch from "node-fetch";
import { logger } from "../utils/logger.js";

class OllamaService {
  constructor() {
    this.baseUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
    this.defaultModel = process.env.OLLAMA_DEFAULT_MODEL || "mistral";
  }

  /**
   * Génère une réponse avec Ollama
   */
  async generateResponse(prompt, options = {}) {
    try {
      const {
        model = this.defaultModel,
        temperature = 0.7,
        maxTokens = 500,
        stream = false,
        context = null,
      } = options;

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
          stream,
          options: {
            temperature,
            num_predict: maxTokens,
          },
          context,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        response: data.response,
        context: data.context,
        model: data.model,
        done: data.done,
      };
    } catch (error) {
      logger.error("Error calling Ollama API:", error);
      throw error;
    }
  }

  /**
   * Chat avec contexte persistant
   */
  async chat(messages, options = {}) {
    try {
      const {
        model = this.defaultModel,
        temperature = 0.7,
        maxTokens = 500,
      } = options;

      // Convertir les messages en format Ollama
      const prompt = this.formatMessagesForOllama(messages);

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          options: {
            temperature,
            num_predict: maxTokens,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        message: data.response,
        model: data.model,
        done: data.done,
      };
    } catch (error) {
      logger.error("Error in Ollama chat:", error);
      throw error;
    }
  }

  /**
   * Génère du code avec assistance IA
   */
  async generateCode(description, language = "python", context = "") {
    try {
      const prompt = `Tu es un assistant de programmation expert. Génère du code ${language} pour: ${description}

${context ? `Contexte: ${context}` : ""}

Réponds uniquement avec le code, sans explication supplémentaire sauf si nécessaire pour la compréhension.`;

      const response = await this.generateResponse(prompt, {
        model: "llama3.2", // Utiliser Llama pour la génération de code
        temperature: 0.3, // Plus déterministe pour le code
        maxTokens: 800,
      });

      return {
        code: response.response,
        language,
        model: response.model,
      };
    } catch (error) {
      logger.error("Error generating code with Ollama:", error);
      throw error;
    }
  }

  /**
   * Explique du code
   */
  async explainCode(code, language = "python") {
    try {
      const prompt = `Explique ce code ${language} de manière claire et pédagogique :

\`\`\`${language}
${code}
\`\`\`

Fournis une explication étape par étape qui aide à comprendre le fonctionnement du code.`;

      const response = await this.generateResponse(prompt, {
        model: "mistral", // Utiliser Mistral pour les explications
        temperature: 0.5,
        maxTokens: 600,
      });

      return {
        explanation: response.response,
        language,
        model: response.model,
      };
    } catch (error) {
      logger.error("Error explaining code with Ollama:", error);
      throw error;
    }
  }

  /**
   * Génère des questions de quiz
   */
  async generateQuizQuestions(topic, difficulty = "intermediate", count = 5) {
    try {
      const prompt = `Génère ${count} questions de quiz sur le sujet "${topic}" avec un niveau de difficulté ${difficulty}.

Format de réponse souhaité (JSON) :
{
  "questions": [
    {
      "text": "Question ici",
      "options": [
        {"text": "Option A", "isCorrect": false},
        {"text": "Option B", "isCorrect": true},
        {"text": "Option C", "isCorrect": false},
        {"text": "Option D", "isCorrect": false}
      ],
      "explanation": "Explication de la bonne réponse"
    }
  ]
}

Assure-toi que les questions sont pertinentes et que les explications sont claires.`;

      const response = await this.generateResponse(prompt, {
        model: "mistral",
        temperature: 0.6,
        maxTokens: 1000,
      });

      // Tenter de parser la réponse JSON
      try {
        const parsed = JSON.parse(response.response);
        return parsed.questions;
      } catch (parseError) {
        logger.warn("Could not parse JSON response, returning raw text");
        return { rawResponse: response.response };
      }
    } catch (error) {
      logger.error("Error generating quiz questions with Ollama:", error);
      throw error;
    }
  }

  /**
   * Génère des recommandations personnalisées
   */
  async generatePersonalizedRecommendations(userProfile, learningHistory) {
    try {
      const prompt = `Basé sur ce profil d'apprenant :
- Niveau mathématiques : ${userProfile.preferences?.mathLevel}
- Niveau programmation : ${userProfile.preferences?.programmingLevel}
- Domaine préféré : ${userProfile.preferences?.preferredDomain}
- Style d'apprentissage : ${userProfile.learningStyle}

Et cet historique d'apprentissage :
${JSON.stringify(learningHistory, null, 2)}

Génère 3-5 recommandations personnalisées pour améliorer l'apprentissage de cet utilisateur. 
Sois spécifique et actionnable dans tes recommandations.`;

      const response = await this.generateResponse(prompt, {
        model: "mistral",
        temperature: 0.7,
        maxTokens: 600,
      });

      return {
        recommendations: response.response,
        model: response.model,
      };
    } catch (error) {
      logger.error("Error generating recommendations with Ollama:", error);
      throw error;
    }
  }

  /**
   * Formate les messages pour Ollama
   */
  formatMessagesForOllama(messages) {
    return messages
      .map(msg => {
        const role = msg.role === "user" ? "Utilisateur" : "Assistant";
        return `${role}: ${msg.content}`;
      })
      .join("\n\n");
  }

  /**
   * Vérifie si Ollama est disponible
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        timeout: 5000, // 5 secondes de timeout
      });
      if (response.ok) {
        const data = await response.json();
        return {
          status: "healthy",
          models: data.models || [],
        };
      }
      return { status: "unhealthy" };
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        logger.warn("Ollama service not running on port 11434");
        return {
          status: "unavailable",
          error:
            "Service Ollama non démarré. Exécutez 'ollama serve' pour le démarrer.",
        };
      }
      logger.error("Ollama health check failed:", error);
      return { status: "unavailable", error: error.message };
    }
  }

  /**
   * Liste les modèles disponibles
   */
  async listModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      logger.error("Error listing Ollama models:", error);
      throw error;
    }
  }
}

export default new OllamaService();
