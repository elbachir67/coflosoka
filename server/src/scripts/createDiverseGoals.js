import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Goal } from "../models/LearningGoal.js";
import { Assessment } from "../models/Assessment.js";
import { Quiz } from "../models/Quiz.js";
import { LearnerProfile } from "../models/LearnerProfile.js";
import { Pathway } from "../models/Pathway.js";
import { Concept } from "../models/Concept.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB for extended data population");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

async function createEmergingConcepts() {
  try {
    const emergingConcepts = [
      // IA Émergente et Tendances 2024-2025
      {
        name: "Large Language Models (LLMs)",
        description:
          "Architecture, entraînement et fine-tuning des modèles de langage massifs (GPT, Claude, LLaMA)",
        category: "nlp",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Retrieval Augmented Generation (RAG)",
        description:
          "Systèmes hybrides combinant recherche d'information et génération de texte",
        category: "nlp",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Multi-Modal AI",
        description:
          "Modèles traitant simultanément texte, image, audio et vidéo (GPT-4V, DALLE-3)",
        category: "dl",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Foundation Models",
        description:
          "Modèles pré-entraînés adaptables à multiples tâches via prompt engineering",
        category: "ml",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Prompt Engineering",
        description:
          "Conception optimale de prompts pour maximiser les performances des LLMs",
        category: "nlp",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "AI Safety et Alignment",
        description:
          "Sécurité IA, biais, robustesse et alignement des objectifs AI-humains",
        category: "ml",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Neuromorphic Computing",
        description:
          "Architecture de calcul inspirée du cerveau, puces neuromorphiques (Intel Loihi)",
        category: "dl",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Quantum Machine Learning",
        description:
          "Algorithmes ML quantiques, avantages computationnels et applications",
        category: "ml",
        level: "advanced",
        prerequisites: [],
      },

      // Applications Sectorielles Africaines
      {
        name: "AI pour la Fintech Africaine",
        description:
          "Credit scoring, mobile payments, détection de fraude adaptés au contexte africain",
        category: "ml",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "HealthTech AI en Afrique",
        description:
          "Diagnostic médical, télémédecine, gestion épidémique avec contraintes locales",
        category: "computer_vision",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "EdTech AI Personnalisée",
        description:
          "Systèmes éducatifs adaptatifs pour l'éducation en langues locales",
        category: "nlp",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "SmartCity AI pour l'Afrique",
        description: "Gestion urbaine intelligente adaptée aux défis africains",
        category: "ml",
        level: "intermediate",
        prerequisites: [],
      },

      // Techniques Avancées
      {
        name: "Neural Architecture Search (NAS)",
        description:
          "Optimisation automatique d'architectures de réseaux de neurones",
        category: "dl",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Meta-Learning",
        description: "Apprentissage à apprendre, few-shot learning, MAML",
        category: "ml",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Continual Learning",
        description:
          "Apprentissage sans oubli catastrophique, elastic weight consolidation",
        category: "ml",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Adversarial Machine Learning",
        description:
          "Attaques adverses, robustesse, défenses et applications sécuritaires",
        category: "ml",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Explainable AI (XAI)",
        description: "Interprétabilité, LIME, SHAP, attention visualization",
        category: "ml",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Green AI",
        description:
          "IA éco-responsable, efficacité énergétique, carbon footprint des modèles",
        category: "mlops",
        level: "intermediate",
        prerequisites: [],
      },

      // Outils et Frameworks 2024-2025
      {
        name: "LangChain et LangSmith",
        description:
          "Framework pour applications LLM, chaînes de traitement, agents",
        category: "nlp",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Weights & Biases (WandB)",
        description:
          "MLOps avancé, tracking expériences, hyperparameter tuning",
        category: "mlops",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Streamlit et Gradio",
        description: "Création rapide d'interfaces pour démos ML",
        category: "mlops",
        level: "basic",
        prerequisites: [],
      },
      {
        name: "Ollama et Local LLMs",
        description:
          "Déploiement local de LLMs, optimisation pour hardware limité",
        category: "nlp",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "vector Databases",
        description:
          "Bases de données vectorielles (Pinecone, Weaviate, Chroma) pour RAG",
        category: "mlops",
        level: "intermediate",
        prerequisites: [],
      },
    ];

    for (const conceptData of emergingConcepts) {
      const concept = new Concept(conceptData);
      await concept.save();
      logger.info(`Emerging concept created: ${conceptData.name}`);
    }

    // Mise à jour des prérequis
    const emergingPrerequisites = {
      "Large Language Models (LLMs)": [
        "Transformers et Attention",
        "Python pour la Data Science",
      ],
      "Retrieval Augmented Generation (RAG)": [
        "Large Language Models (LLMs)",
        "vector Databases",
      ],
      "Multi-Modal AI": [
        "CNN - Vision par Ordinateur",
        "Large Language Models (LLMs)",
      ],
      "Foundation Models": [
        "Large Language Models (LLMs)",
        "Transfer Learning",
      ],
      "Prompt Engineering": ["Large Language Models (LLMs)", "NLP Fondamental"],
      "AI Safety et Alignment": ["Large Language Models (LLMs)", "Éthique IA"],
      "Neuromorphic Computing": ["Réseaux de Neurones", "Architecture GPU"],
      "Quantum Machine Learning": [
        "Apprentissage Supervisé",
        "Physique Quantique",
      ],
      "Neural Architecture Search (NAS)": [
        "CNN - Vision par Ordinateur",
        "Optimisation Mathématique",
      ],
      "Meta-Learning": ["Apprentissage Supervisé", "Optimisation Mathématique"],
      "Adversarial Machine Learning": [
        "Apprentissage Supervisé",
        "AI Safety et Alignment",
      ],
      "LangChain et LangSmith": [
        "Large Language Models (LLMs)",
        "Python pour la Data Science",
      ],
      "vector Databases": ["Bases de Données", "Word Embeddings"],
    };

    const allConcepts = await Concept.find();
    const conceptMap = {};
    allConcepts.forEach(concept => {
      conceptMap[concept.name] = concept._id;
    });

    for (const [conceptName, prereqNames] of Object.entries(
      emergingPrerequisites
    )) {
      const prereqIds = prereqNames
        .map(name => conceptMap[name])
        .filter(id => id);
      if (conceptMap[conceptName]) {
        await Concept.findByIdAndUpdate(conceptMap[conceptName], {
          prerequisites: prereqIds,
        });
      }
    }
  } catch (error) {
    logger.error("Error creating emerging concepts:", error);
  }
}

async function createAdvancedGoals() {
  try {
    const advancedGoals = [
      {
        title: "Architecte IA Générative",
        description: "Expert en systèmes IA générative et modèles de fondation",
        category: "dl",
        level: "advanced",
        estimatedDuration: 20,
        prerequisites: [
          {
            category: "theory",
            skills: [
              { name: "Deep Learning", level: "advanced" },
              { name: "Transformers", level: "advanced" },
            ],
          },
          {
            category: "programming",
            skills: [
              { name: "Python", level: "advanced" },
              { name: "PyTorch/TensorFlow", level: "advanced" },
            ],
          },
        ],
        modules: [
          {
            title: "Large Language Models et Foundation Models",
            description: "Architecture, entraînement et déploiement des LLMs",
            duration: 40,
            skills: [
              { name: "LLM Architecture", level: "advanced" },
              { name: "Scaling Laws", level: "intermediate" },
              { name: "Fine-tuning", level: "advanced" },
            ],
            resources: [
              {
                title: "Attention Is All You Need - Original Transformer Paper",
                type: "article",
                url: "https://arxiv.org/abs/1706.03762",
                duration: 60,
              },
              {
                title: "Language Models are Few-Shot Learners (GPT-3)",
                type: "article",
                url: "https://arxiv.org/abs/2005.14165",
                duration: 90,
              },
              {
                title: "PaLM: Scaling Language Modeling with Pathways",
                type: "article",
                url: "https://arxiv.org/abs/2204.02311",
                duration: 80,
              },
              {
                title: "LLaMA: Open and Efficient Foundation Language Models",
                type: "article",
                url: "https://arxiv.org/abs/2302.13971",
                duration: 70,
              },
              {
                title: "Hugging Face Transformers Course",
                type: "course",
                url: "https://huggingface.co/course",
                duration: 200,
              },
              {
                title: "OpenAI Fine-tuning Guide",
                type: "article",
                url: "https://platform.openai.com/docs/guides/fine-tuning",
                duration: 120,
              },
              {
                title: "Stanford CS324: Large Language Models",
                type: "course",
                url: "https://stanford-cs324.github.io/winter2022/",
                duration: 300,
              },
            ],
            validationCriteria: [
              "Comprendre l'architecture Transformer en profondeur",
              "Implémenter un LLM simplifié from scratch",
              "Fine-tuner un modèle pré-entraîné pour une tâche spécifique",
              "Évaluer les performances avec des métriques appropriées",
            ],
          },
          {
            title: "Prompt Engineering et Chain-of-Thought",
            description:
              "Optimisation des prompts et techniques de raisonnement",
            duration: 25,
            skills: [
              { name: "Prompt Design", level: "advanced" },
              { name: "Chain-of-Thought", level: "intermediate" },
              { name: "Few-Shot Learning", level: "intermediate" },
            ],
            resources: [
              {
                title: "Chain-of-Thought Prompting Paper",
                type: "article",
                url: "https://arxiv.org/abs/2201.11903",
                duration: 45,
              },
              {
                title: "OpenAI Prompt Engineering Guide",
                type: "article",
                url: "https://platform.openai.com/docs/guides/prompt-engineering",
                duration: 90,
              },
              {
                title: "Anthropic Prompt Engineering Guide",
                type: "article",
                url: "https://docs.anthropic.com/claude/docs/prompt-engineering",
                duration: 80,
              },
              {
                title: "LangChain Prompt Templates",
                type: "article",
                url: "https://docs.langchain.com/docs/components/prompts/",
                duration: 60,
              },
              {
                title: "Learn Prompting - Comprehensive Course",
                type: "course",
                url: "https://learnprompting.org/",
                duration: 150,
              },
            ],
            validationCriteria: [
              "Concevoir des prompts pour différents types de tâches",
              "Implémenter chain-of-thought reasoning",
              "Optimiser les performances via prompt tuning",
              "Évaluer la qualité des outputs générés",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "Generative AI Engineer",
            description: "Développement d'applications IA générative",
            averageSalary: "80-140k€/an",
            companies: [
              "OpenAI",
              "Anthropic",
              "Stability AI",
              "Midjourney",
              "Runway",
            ],
          },
          {
            title: "LLM Applications Developer",
            description: "Création d'applications basées sur les LLMs",
            averageSalary: "70-120k€/an",
            companies: [
              "Google",
              "Microsoft",
              "Amazon",
              "Meta",
              "Hugging Face",
            ],
          },
        ],
        certification: {
          available: true,
          name: "Generative AI Architect Certificate",
          provider: "UCAD AI Research Center",
          url: "https://ucad.sn/certifications/generative-ai-architect",
        },
        requiredConcepts: [],
      },

      {
        title: "Expert IA pour l'Impact Social",
        description:
          "Applications IA pour résoudre les défis sociétaux africains",
        category: "ml",
        level: "intermediate",
        estimatedDuration: 16,
        prerequisites: [
          {
            category: "theory",
            skills: [
              { name: "Machine Learning", level: "intermediate" },
              { name: "Data Science", level: "intermediate" },
            ],
          },
          {
            category: "programming",
            skills: [{ name: "Python", level: "intermediate" }],
          },
        ],
        modules: [
          {
            title: "IA pour la Santé en Afrique",
            description:
              "Solutions IA adaptées aux systèmes de santé africains",
            duration: 30,
            skills: [
              { name: "Medical Imaging", level: "intermediate" },
              { name: "Diagnostic AI", level: "intermediate" },
              { name: "Telemedicine", level: "basic" },
            ],
            resources: [
              {
                title: "AI for Social Good - Healthcare Applications",
                type: "article",
                url: "https://ai4sg.org/healthcare",
                duration: 90,
              },
              {
                title: "Medical Image Analysis with Deep Learning",
                type: "course",
                url: "https://www.coursera.org/learn/medical-image-analysis",
                duration: 200,
              },
              {
                title: "WHO Digital Health Guidelines",
                type: "article",
                url: "https://www.who.int/publications/i/item/9789241550505",
                duration: 120,
              },
            ],
            validationCriteria: [
              "Développer un système de diagnostic par IA",
              "Adapter des modèles aux contraintes locales",
              "Évaluer l'impact social et clinique",
              "Collaborer avec des professionnels de santé",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "AI for Good Specialist",
            description: "Applications IA pour l'impact social",
            averageSalary: "40-75k€/an",
            companies: [
              "ONU",
              "Banque Mondiale",
              "Gates Foundation",
              "ONG Tech",
            ],
          },
        ],
        certification: {
          available: true,
          name: "AI for Social Impact Certificate",
          provider: "UCAD Social Innovation Lab",
          url: "https://ucad.sn/certifications/ai-social-impact",
        },
        requiredConcepts: [],
      },

      {
        title: "Spécialiste MLOps et AI Infrastructure",
        description:
          "Expert en industrialisation et infrastructure IA à grande échelle",
        category: "mlops",
        level: "advanced",
        estimatedDuration: 18,
        prerequisites: [
          {
            category: "programming",
            skills: [
              { name: "Python", level: "advanced" },
              { name: "Docker", level: "intermediate" },
              { name: "Cloud", level: "intermediate" },
            ],
          },
          {
            category: "theory",
            skills: [{ name: "Machine Learning", level: "intermediate" }],
          },
        ],
        modules: [
          {
            title: "Infrastructure Cloud-Native pour IA",
            description: "Architecture scalable et résiliente pour systèmes IA",
            duration: 35,
            skills: [
              { name: "Kubernetes", level: "advanced" },
              { name: "Microservices", level: "intermediate" },
              { name: "Cloud Providers", level: "advanced" },
            ],
            resources: [
              {
                title: "Kubernetes for Machine Learning",
                type: "book",
                url: "https://www.oreilly.com/library/view/kubernetes-for-machine/9781492083291/",
                duration: 200,
              },
              {
                title: "Kubeflow Documentation",
                type: "article",
                url: "https://www.kubeflow.org/docs/",
                duration: 150,
              },
            ],
            validationCriteria: [
              "Déployer des modèles sur Kubernetes",
              "Gérer des pipelines ML dans le cloud",
              "Optimiser les coûts et performances",
              "Assurer la haute disponibilité",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "Senior MLOps Engineer",
            description: "Architecture et infrastructure ML enterprise",
            averageSalary: "70-130k€/an",
            companies: ["Netflix", "Uber", "Airbnb", "Spotify", "Twitter"],
          },
        ],
        certification: {
          available: true,
          name: "Advanced MLOps Professional",
          provider: "UCAD Engineering Institute",
          url: "https://ucad.sn/certifications/advanced-mlops",
        },
        requiredConcepts: [],
      },

      {
        title: "Consultant IA et Transformation Digitale",
        description: "Expert en stratégie IA et accompagnement transformation",
        category: "ml",
        level: "intermediate",
        estimatedDuration: 14,
        prerequisites: [
          {
            category: "theory",
            skills: [{ name: "Machine Learning", level: "intermediate" }],
          },
          {
            category: "tools",
            skills: [
              { name: "Strategy", level: "intermediate" },
              { name: "Project Management", level: "intermediate" },
            ],
          },
        ],
        modules: [
          {
            title: "Stratégie IA et Business Value",
            description: "Identification d'opportunités IA et ROI",
            duration: 25,
            skills: [
              { name: "AI Strategy", level: "advanced" },
              { name: "Business Case", level: "intermediate" },
              { name: "ROI Analysis", level: "intermediate" },
            ],
            resources: [
              {
                title: "AI Strategy and Leadership",
                type: "book",
                url: "https://www.oreilly.com/library/view/ai-strategy-and/9781492073802/",
                duration: 180,
              },
              {
                title: "McKinsey AI Insights",
                type: "article",
                url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights",
                duration: 120,
              },
            ],
            validationCriteria: [
              "Élaborer une stratégie IA d'entreprise",
              "Calculer le ROI de projets IA",
              "Identifier les cas d'usage prioritaires",
              "Présenter à des dirigeants",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "AI Strategy Consultant",
            description: "Conseil en stratégie et transformation IA",
            averageSalary: "60-120k€/an",
            companies: ["McKinsey", "BCG", "Deloitte", "Accenture", "PwC"],
          },
        ],
        certification: {
          available: true,
          name: "AI Strategy & Consulting Professional",
          provider: "UCAD Business School",
          url: "https://ucad.sn/certifications/ai-strategy",
        },
        requiredConcepts: [],
      },
    ];

    for (const goalData of advancedGoals) {
      const goal = new Goal(goalData);
      await goal.save();
      logger.info(`Advanced goal created: ${goalData.title}`);
    }
  } catch (error) {
    logger.error("Error creating advanced goals:", error);
  }
}

async function createSpecializedAssessments() {
  try {
    const specializedAssessments = [
      {
        title: "Évaluation LLMs et IA Générative",
        category: "dl",
        difficulty: "advanced",
        questions: [
          {
            text: "Que signifie 'emergent abilities' dans le contexte des Large Language Models ?",
            options: [
              {
                text: "Capacités qui émergent seulement à grande échelle, non présentes dans les petits modèles",
                isCorrect: true,
              },
              {
                text: "Capacités programmées explicitement par les développeurs",
                isCorrect: false,
              },
              {
                text: "Erreurs qui apparaissent dans les grands modèles",
                isCorrect: false,
              },
              {
                text: "Nouvelles architectures de réseaux de neurones",
                isCorrect: false,
              },
            ],
            explanation:
              "Les 'emergent abilities' sont des capacités qui n'apparaissent qu'au-delà d'une certaine taille de modèle, comme le raisonnement complexe ou la résolution de problèmes mathématiques.",
          },
          {
            text: "Dans un système RAG, pourquoi utiliser des embeddings plutôt qu'une recherche textuelle traditionnelle ?",
            options: [
              {
                text: "Les embeddings capturent la similarité sémantique, pas seulement lexicale",
                isCorrect: true,
              },
              {
                text: "Les embeddings sont plus rapides à calculer",
                isCorrect: false,
              },
              {
                text: "Les embeddings prennent moins d'espace de stockage",
                isCorrect: false,
              },
              {
                text: "Les embeddings sont plus faciles à implémenter",
                isCorrect: false,
              },
            ],
            explanation:
              "Les embeddings permettent de trouver des documents sémantiquement similaires même s'ils n'utilisent pas les mêmes mots-clés exacts.",
          },
        ],
        recommendedGoals: [],
      },

      {
        title: "Évaluation IA pour l'Impact Social",
        category: "ml",
        difficulty: "intermediate",
        questions: [
          {
            text: "Quel défi majeur pour l'IA médicale dans les pays en développement ?",
            options: [
              {
                text: "Manque de données représentatives et infrastructure limitée",
                isCorrect: true,
              },
              {
                text: "Algorithmes inappropriés uniquement",
                isCorrect: false,
              },
              {
                text: "Coût des GPU trop élevé",
                isCorrect: false,
              },
              {
                text: "Résistance culturelle absolue",
                isCorrect: false,
              },
            ],
            explanation:
              "Les datasets médicaux sont souvent biaisés vers les populations occidentales, et l'infrastructure technique peut être limitée.",
          },
        ],
        recommendedGoals: [],
      },
    ];

    for (const assessmentData of specializedAssessments) {
      const assessment = new Assessment(assessmentData);
      await assessment.save();
      logger.info(`Specialized assessment created: ${assessmentData.title}`);
    }
  } catch (error) {
    logger.error("Error creating specialized assessments:", error);
  }
}

async function createAdvancedUsers() {
  try {
    const advancedUsers = [
      {
        email: "aminata.traore@ucad.edu.sn",
        password: "Aminata123!",
        role: "user",
      },
      {
        email: "boubacar.diallo@ucad.edu.sn",
        password: "Boubacar123!",
        role: "user",
      },
      {
        email: "ndeye.sarr@ucad.edu.sn",
        password: "Ndeye123!",
        role: "user",
      },
      {
        email: "ibrahima.cisse@ucad.edu.sn",
        password: "Ibrahima123!",
        role: "user",
      },
    ];

    for (const userData of advancedUsers) {
      const user = new User(userData);
      await user.save();
      logger.info(`Advanced user created: ${userData.email}`);
    }
  } catch (error) {
    logger.error("Error creating advanced users:", error);
  }
}

async function createProjectBasedQuizzes() {
  try {
    const goals = await Goal.find();

    for (const goal of goals) {
      for (let i = 0; i < goal.modules.length; i++) {
        const module = goal.modules[i];
        const moduleTitle = module.title;

        const questions = [
          {
            text: `Projet appliqué: Comment mesureriez-vous le succès d'une implémentation de "${moduleTitle}" dans un contexte africain ?`,
            options: [
              {
                text: "KPIs techniques + impact utilisateur + adoption + durabilité économique + adaptation culturelle",
                isCorrect: true,
              },
              {
                text: "Seulement les métriques techniques standard",
                isCorrect: false,
              },
              {
                text: "Uniquement la satisfaction des développeurs",
                isCorrect: false,
              },
              {
                text: "Seulement comparer aux benchmarks internationaux",
                isCorrect: false,
              },
            ],
            explanation: `Le succès en contexte africain nécessite une évaluation holistique incluant impact technique, social, et durabilité.`,
          },
        ];

        const quiz = new Quiz({
          moduleId: module._id.toString(),
          title: `Quiz Projet - ${moduleTitle}`,
          description: `Évaluation par projets concrets et cas d'usage réels pour ${moduleTitle}`,
          timeLimit: 3600,
          passingScore: 75,
          questions: questions,
        });

        await quiz.save();
        logger.info(`Project-based quiz created for module: ${moduleTitle}`);
      }
    }
  } catch (error) {
    logger.error("Error creating project-based quizzes:", error);
  }
}

async function createHybridLearningPathways() {
  try {
    const users = await User.find({ role: "user" });
    const goals = await Goal.find();

    if (users.length < 4) {
      logger.warn("Not enough users for hybrid pathways");
      return;
    }

    const hybridPathways = [
      {
        userId: users[users.length - 1]._id,
        goalId:
          goals.find(g => g.title === "Architecte IA Générative")?._id ||
          goals[0]._id,
        status: "active",
        progress: 35,
        currentModule: 1,
        moduleProgress: [
          {
            moduleIndex: 0,
            completed: true,
            locked: false,
            resources: [
              {
                resourceId: "attention_is_all_you_need",
                completed: true,
                completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
              },
            ],
            quiz: {
              completed: true,
              score: 82,
              completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
            },
          },
        ],
        startedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        lastAccessedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        estimatedCompletionDate: new Date(
          Date.now() + 120 * 24 * 60 * 60 * 1000
        ),
        adaptiveRecommendations: [
          {
            type: "practice",
            description:
              "Implémenter un chatbot avec RAG pour répondre aux questions sur l'UCAD",
            priority: "high",
            status: "pending",
          },
        ],
        nextGoals: [],
      },
    ];

    for (const pathwayData of hybridPathways) {
      const pathway = new Pathway(pathwayData);
      await pathway.save();
      logger.info(`Hybrid pathway created for user: ${pathwayData.userId}`);
    }
  } catch (error) {
    logger.error("Error creating hybrid pathways:", error);
  }
}

async function createDiversifiedProfiles() {
  try {
    const users = await User.find({ role: "user" });
    const goals = await Goal.find();

    if (users.length < 4) {
      logger.warn("Not enough users for diversified profiles");
      return;
    }

    const diversifiedProfiles = [
      {
        userId: users[users.length - 1]._id,
        learningStyle: "kinesthetic",
        preferences: {
          mathLevel: "advanced",
          programmingLevel: "advanced",
          preferredDomain: "nlp",
        },
        assessments: [
          {
            category: "dl",
            score: 92,
            responses: [
              {
                questionId: "llm_emergent_1",
                selectedOption:
                  "Capacités qui émergent seulement à grande échelle, non présentes dans les petits modèles",
                timeSpent: 75,
                category: "dl",
                difficulty: "advanced",
              },
            ],
            recommendations: [
              {
                category: "dl",
                score: 92,
                recommendations: [
                  "Explorer les dernières avancées en architecture Transformer",
                  "Développer des applications LLM innovantes",
                  "Contribuer à des projets open-source comme Hugging Face",
                ],
              },
            ],
            completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          },
        ],
        goal:
          goals.find(g => g.title === "Architecte IA Générative")?._id ||
          goals[0]._id,
      },
    ];

    for (const profileData of diversifiedProfiles) {
      const profile = new LearnerProfile(profileData);
      await profile.save();
      logger.info(
        `Diversified profile created for user: ${profileData.userId}`
      );
    }
  } catch (error) {
    logger.error("Error creating diversified profiles:", error);
  }
}

async function extendDatabase() {
  try {
    await connectDB();

    logger.info(
      "Starting extended database population with cutting-edge AI content..."
    );

    await createEmergingConcepts();
    await createAdvancedGoals();
    await createSpecializedAssessments();
    await createProjectBasedQuizzes();
    await createAdvancedUsers();
    await createHybridLearningPathways();
    await createDiversifiedProfiles();

    // Statistiques finales
    const stats = {
      users: await User.countDocuments(),
      concepts: await Concept.countDocuments(),
      goals: await Goal.countDocuments(),
      assessments: await Assessment.countDocuments(),
      quizzes: await Quiz.countDocuments(),
      profiles: await LearnerProfile.countDocuments(),
      pathways: await Pathway.countDocuments(),
    };

    logger.info("\n=== 🚀 EXTENDED DATABASE POPULATION COMPLETED ===");
    logger.info(`👥 Total Users: ${stats.users}`);
    logger.info(`🧠 Total Concepts: ${stats.concepts}`);
    logger.info(`🎯 Total Learning Goals: ${stats.goals}`);
    logger.info(`📊 Total Assessments: ${stats.assessments}`);
    logger.info(`📝 Total Quizzes: ${stats.quizzes}`);
    logger.info(`👤 Total Learner Profiles: ${stats.profiles}`);
    logger.info(`🛤️  Total Learning Pathways: ${stats.pathways}`);
    logger.info("\n✅ UCAD IA Learning Platform - Cutting-edge Edition Ready!");
    logger.info(
      "🌟 Focus: LLMs, IA Générative, Impact Social, MLOps Avancé, Stratégie IA"
    );
    logger.info(
      "🌍 Vision: Former les leaders IA de demain en Afrique et dans le monde"
    );
  } catch (error) {
    logger.error("Error during extended database population:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Exécuter l'extension de base de données
extendDatabase();
