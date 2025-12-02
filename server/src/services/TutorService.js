import { logger } from "../utils/logger.js";

class TutorService {
  constructor() {
    this.baseUrl = process.env.OLLAMA_URL || "http://localhost:11434";
    this.defaultModel = "tinyllama";
  }

  // Catégories disponibles avec leurs descriptions
  getCategories() {
    return [
      {
        id: "ml",
        name: "Machine Learning",
        icon: "Brain",
        description: "Apprentissage automatique et algorithmes",
        color: "purple"
      },
      {
        id: "dl",
        name: "Deep Learning",
        icon: "Network",
        description: "Réseaux de neurones profonds",
        color: "blue"
      },
      {
        id: "nlp",
        name: "NLP",
        icon: "MessageSquare",
        description: "Traitement du langage naturel",
        color: "green"
      },
      {
        id: "cv",
        name: "Computer Vision",
        icon: "Eye",
        description: "Vision par ordinateur",
        color: "orange"
      },
      {
        id: "math",
        name: "Maths pour l'IA",
        icon: "Calculator",
        description: "Fondements mathématiques",
        color: "red"
      },
      {
        id: "python",
        name: "Python",
        icon: "Code",
        description: "Programmation Python pour l'IA",
        color: "yellow"
      }
    ];
  }

  // Questions suggérées par catégorie
  getSuggestedQuestions(categoryId) {
    const questions = {
      ml: [
        "C'est quoi le Machine Learning ?",
        "Quelle est la différence entre supervisé et non supervisé ?",
        "Comment fonctionne un algorithme de classification ?",
        "Qu'est-ce que l'overfitting ?",
        "C'est quoi une régression linéaire ?"
      ],
      dl: [
        "C'est quoi un réseau de neurones ?",
        "Comment fonctionne le backpropagation ?",
        "Qu'est-ce qu'un CNN ?",
        "C'est quoi une fonction d'activation ?",
        "Quelle est la différence entre RNN et LSTM ?"
      ],
      nlp: [
        "C'est quoi le NLP ?",
        "Comment fonctionne un tokenizer ?",
        "Qu'est-ce qu'un embedding de mots ?",
        "C'est quoi un Transformer ?",
        "Comment fonctionne l'attention en NLP ?"
      ],
      cv: [
        "C'est quoi la Computer Vision ?",
        "Comment fonctionne la détection d'objets ?",
        "Qu'est-ce qu'une convolution ?",
        "C'est quoi le pooling ?",
        "Comment fonctionne la reconnaissance faciale ?"
      ],
      math: [
        "C'est quoi un gradient ?",
        "Comment fonctionne la descente de gradient ?",
        "Qu'est-ce qu'une matrice ?",
        "C'est quoi une dérivée partielle ?",
        "Comment calculer une probabilité conditionnelle ?"
      ],
      python: [
        "C'est quoi NumPy ?",
        "Comment créer un DataFrame avec Pandas ?",
        "Qu'est-ce qu'une list comprehension ?",
        "C'est quoi TensorFlow ?",
        "Comment utiliser Scikit-learn ?"
      ]
    };

    return questions[categoryId] || questions.ml;
  }

  // Construire le prompt système pour le tuteur
  buildSystemPrompt(language, category) {
    const categoryNames = {
      ml: "Machine Learning",
      dl: "Deep Learning",
      nlp: "Traitement du Langage Naturel (NLP)",
      cv: "Computer Vision",
      math: "Mathématiques pour l'IA",
      python: "Python pour l'IA"
    };

    const categoryName = categoryNames[category] || "Intelligence Artificielle";

    if (language === "fr") {
      return `Tu es un tuteur IA pédagogue spécialisé en ${categoryName}. Tu expliques les concepts aux débutants de manière simple et accessible.

RÈGLES STRICTES:
- Maximum 100 mots au total
- Utilise des analogies du quotidien (cuisine, sport, vie courante)
- Pas de jargon technique complexe
- Langage simple et amical

FORMAT DE RÉPONSE (respecte exactement ce format):
📖 Définition: [2-3 phrases simples expliquant le concept]

🎯 Analogie: [1 exemple concret de la vie quotidienne]

💡 À retenir: [1 phrase clé résumant l'essentiel]`;
    } else {
      return `You are a pedagogical AI tutor specialized in ${categoryName}. You explain concepts to beginners in a simple and accessible way.

STRICT RULES:
- Maximum 100 words total
- Use everyday analogies (cooking, sports, daily life)
- No complex technical jargon
- Simple and friendly language

RESPONSE FORMAT (follow this format exactly):
📖 Definition: [2-3 simple sentences explaining the concept]

🎯 Analogy: [1 concrete example from everyday life]

💡 Key takeaway: [1 sentence summarizing the essential point]`;
    }
  }

  // Envoyer une question au tuteur
  async askTutor(question, category = "ml", language = "fr") {
    try {
      const systemPrompt = this.buildSystemPrompt(language, category);

      const fullPrompt = `${systemPrompt}

Question: ${question}

Réponse:`;

      logger.info(`Tutor request - Category: ${category}, Language: ${language}`);

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.defaultModel,
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 256 // Limiter la longueur de la réponse
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();

      logger.info("Tutor response received successfully");

      return {
        success: true,
        response: data.response,
        model: this.defaultModel,
        category,
        language
      };
    } catch (error) {
      logger.error("Tutor service error:", error);

      // Message d'erreur convivial
      const errorMessage = language === "fr"
        ? "Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard."
        : "Sorry, I cannot respond at the moment. Please try again later.";

      return {
        success: false,
        error: error.message,
        response: errorMessage
      };
    }
  }

  // Vérifier si le modèle TinyLlama est disponible
  async checkModelAvailability() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json();

      const models = data.models || [];
      const hasTinyLlama = models.some(m =>
        m.name.toLowerCase().includes("tinyllama")
      );

      return {
        available: true,
        hasTinyLlama,
        models: models.map(m => m.name)
      };
    } catch (error) {
      logger.error("Error checking model availability:", error);
      return {
        available: false,
        hasTinyLlama: false,
        models: []
      };
    }
  }
}

export default new TutorService();
