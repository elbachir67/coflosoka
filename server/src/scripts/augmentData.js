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
    logger.info("Connected to MongoDB for data augmentation");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

async function createAdditionalConcepts() {
  try {
    const newConcepts = [
      // Mathématiques avancées pour l'IA
      {
        name: "Géométrie Différentielle",
        description:
          "Variétés, tenseurs, métriques riemanniennes pour le deep learning géométrique",
        category: "math",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Théorie des Graphes",
        description:
          "Algorithmes sur graphes, centralité, clustering, applications aux réseaux de neurones graphiques",
        category: "math",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Analyse Fonctionnelle",
        description:
          "Espaces de Banach, Hilbert, opérateurs linéaires, applications aux kernel methods",
        category: "math",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Logique et Preuves Automatiques",
        description:
          "Logique propositionnelle, prédicats, systèmes de preuves pour l'IA symbolique",
        category: "math",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Théorie des Jeux",
        description:
          "Équilibres, stratégies optimales, applications aux systèmes multi-agents",
        category: "math",
        level: "intermediate",
        prerequisites: [],
      },

      // Programmation et outils
      {
        name: "Programmation Fonctionnelle",
        description:
          "Concepts FP, lambda calcul, applications en ML avec Haskell/Scala",
        category: "programming",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "CUDA et Programmation GPU",
        description:
          "Programmation parallèle, optimisation GPU, kernels CUDA pour deep learning",
        category: "programming",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Web Scraping et APIs",
        description:
          "Extraction de données, APIs REST, rate limiting, éthique du scraping",
        category: "programming",
        level: "basic",
        prerequisites: [],
      },
      {
        name: "Systèmes Distribués",
        description:
          "Architectures distribuées, consensus, CAP theorem, applications Big Data",
        category: "programming",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Rust pour ML",
        description:
          "Programmation système, sécurité mémoire, bindings Python, performance",
        category: "programming",
        level: "intermediate",
        prerequisites: [],
      },

      // Machine Learning spécialisé
      {
        name: "Apprentissage par Transfert",
        description:
          "Domain adaptation, fine-tuning, few-shot learning, meta-learning",
        category: "ml",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "AutoML",
        description:
          "Optimisation d'hyperparamètres, NAS, automated feature engineering",
        category: "ml",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Apprentissage Fédéré",
        description:
          "Federated learning, privacy-preserving ML, secure aggregation",
        category: "ml",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Causal Inference",
        description:
          "Causalité vs corrélation, DAGs causaux, do-calculus, applications ML",
        category: "ml",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Apprentissage Continuel",
        description:
          "Lifelong learning, catastrophic forgetting, elastic weight consolidation",
        category: "ml",
        level: "advanced",
        prerequisites: [],
      },

      // Deep Learning avancé
      {
        name: "Generative Adversarial Networks",
        description:
          "GANs, architectures variantes, training stability, applications créatives",
        category: "dl",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Variational Autoencoders",
        description:
          "VAEs, reparameterization trick, latent spaces, génération conditionnelle",
        category: "dl",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Diffusion Models",
        description:
          "DDPM, score-based models, applications image/audio, stable diffusion",
        category: "dl",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Neural Architecture Search",
        description: "NAS, DARTS, progressive search, efficient architectures",
        category: "dl",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Pruning et Quantization",
        description:
          "Compression de modèles, sparsité structurée, quantization aware training",
        category: "dl",
        level: "advanced",
        prerequisites: [],
      },

      // Computer Vision spécialisé
      {
        name: "SLAM et Reconstruction 3D",
        description:
          "Simultaneous Localization and Mapping, Structure from Motion, NeRF",
        category: "computer_vision",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Vision par Ordinateur Médicale",
        description:
          "Imagerie médicale, segmentation d'organes, diagnostic assisté",
        category: "computer_vision",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Synthèse d'Images",
        description:
          "Neural rendering, style transfer, image-to-image translation",
        category: "computer_vision",
        level: "advanced",
        prerequisites: [],
      },

      // NLP avancé
      {
        name: "Large Language Models",
        description:
          "GPT, scaling laws, emergent abilities, prompt engineering",
        category: "nlp",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Multilingual NLP",
        description:
          "Cross-lingual models, zero-shot transfer, low-resource languages",
        category: "nlp",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Knowledge Graphs",
        description:
          "Graph embeddings, entity linking, relation extraction, reasoning",
        category: "nlp",
        level: "advanced",
        prerequisites: [],
      },

      // MLOps avancé
      {
        name: "ML Security",
        description:
          "Adversarial attacks, model robustness, privacy attacks, defenses",
        category: "mlops",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Edge AI",
        description:
          "Déploiement mobile, TensorFlow Lite, optimisation embarquée",
        category: "mlops",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "ML Observability",
        description:
          "Monitoring avancé, explainability, interpretability, fairness",
        category: "mlops",
        level: "advanced",
        prerequisites: [],
      },
    ];

    for (const conceptData of newConcepts) {
      const concept = new Concept(conceptData);
      await concept.save();
      logger.info(`Additional concept created: ${conceptData.name}`);
    }

    // Mise à jour des prérequis pour les nouveaux concepts
    const additionalPrerequisites = {
      "Géométrie Différentielle": [
        "Calcul Différentiel et Intégral",
        "Algèbre Linéaire pour l'IA",
      ],
      "Analyse Fonctionnelle": [
        "Calcul Différentiel et Intégral",
        "Algèbre Linéaire pour l'IA",
      ],
      "CUDA et Programmation GPU": [
        "Python Fondamentaux",
        "Algèbre Linéaire pour l'IA",
      ],
      "Programmation Fonctionnelle": ["Python Fondamentaux"],
      "Apprentissage par Transfert": [
        "Réseaux de Neurones",
        "CNN - Vision par Ordinateur",
      ],
      AutoML: ["Ensemble Methods", "Optimisation Mathématique"],
      "Apprentissage Fédéré": [
        "Apprentissage Supervisé",
        "Probabilités et Statistiques",
      ],
      "Generative Adversarial Networks": [
        "Réseaux de Neurones",
        "Optimisation Mathématique",
      ],
      "Variational Autoencoders": [
        "Réseaux de Neurones",
        "Probabilités et Statistiques",
      ],
      "Diffusion Models": [
        "Réseaux de Neurones",
        "Probabilités et Statistiques",
      ],
      "SLAM et Reconstruction 3D": [
        "CNN - Vision par Ordinateur",
        "Géométrie Différentielle",
      ],
      "Large Language Models": [
        "Transformers et Attention",
        "Optimisation Mathématique",
      ],
      "ML Security": ["Apprentissage Supervisé", "Optimisation Mathématique"],
    };

    const allConcepts = await Concept.find();
    const conceptMap = {};
    allConcepts.forEach(concept => {
      conceptMap[concept.name] = concept._id;
    });

    for (const [conceptName, prereqNames] of Object.entries(
      additionalPrerequisites
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
    logger.error("Error creating additional concepts:", error);
  }
}

async function createAdditionalGoals() {
  try {
    const additionalGoals = [
      {
        title: "Chercheur en IA",
        description:
          "Formation recherche en intelligence artificielle avec focus théorique et publications",
        category: "ml",
        level: "advanced",
        estimatedDuration: 24,
        prerequisites: [
          {
            category: "math",
            skills: [
              { name: "Algèbre linéaire", level: "advanced" },
              { name: "Probabilités", level: "advanced" },
              { name: "Optimisation", level: "advanced" },
              { name: "Analyse fonctionnelle", level: "intermediate" },
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
            title: "Fondements Théoriques de l'IA",
            description: "Bases mathématiques et théoriques pour la recherche",
            duration: 40,
            skills: [
              { name: "Théorie de l'apprentissage", level: "advanced" },
              { name: "Complexité algorithmique", level: "advanced" },
              { name: "Analyse théorique", level: "advanced" },
            ],
            resources: [
              {
                title: "Understanding Machine Learning - Shalev-Shwartz",
                type: "book",
                url: "https://www.cs.huji.ac.il/~shais/UnderstandingMachineLearning/",
                duration: 300,
              },
              {
                title: "The Elements of Statistical Learning - Hastie",
                type: "book",
                url: "https://hastie.su.domains/ElemStatLearn/",
                duration: 400,
              },
              {
                title: "Pattern Recognition and Machine Learning - Bishop",
                type: "book",
                url: "https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/",
                duration: 350,
              },
              {
                title: "Information Theory, Inference, and Learning - MacKay",
                type: "book",
                url: "http://www.inference.org.uk/mackay/itila/",
                duration: 400,
              },
              {
                title: "Foundations of Machine Learning - Mohri",
                type: "book",
                url: "https://cs.nyu.edu/~mohri/mlbook/",
                duration: 280,
              },
              {
                title: "CS229 Machine Learning - Andrew Ng (Stanford)",
                type: "course",
                url: "http://cs229.stanford.edu/",
                duration: 200,
              },
              {
                title: "Concentration Inequalities - Boucheron",
                type: "article",
                url: "https://arxiv.org/abs/1309.3864",
                duration: 80,
              },
            ],
            validationCriteria: [
              "Maîtriser les bornes de généralisation et théorie PAC",
              "Comprendre les fondements théoriques de l'optimisation convexe",
              "Analyser la complexité d'échantillonnage des algorithmes",
              "Démontrer des propriétés théoriques de convergence",
            ],
          },
          {
            title: "Méthodologie de Recherche",
            description:
              "Méthodes de recherche, rédaction scientifique, évaluation",
            duration: 30,
            skills: [
              { name: "Rédaction scientifique", level: "advanced" },
              { name: "Expérimentation", level: "advanced" },
              { name: "Peer review", level: "intermediate" },
            ],
            resources: [
              {
                title: "The Craft of Research - Booth",
                type: "book",
                url: "https://press.uchicago.edu/ucp/books/book/chicago/C/bo3773648.html",
                duration: 200,
              },
              {
                title: "Writing for Computer Science - Zobel",
                type: "book",
                url: "https://www.springer.com/gp/book/9781852338022",
                duration: 150,
              },
              {
                title: "Papers We Love - Machine Learning",
                type: "article",
                url: "https://paperswelove.org/",
                duration: 100,
              },
              {
                title: "arXiv Sanity Preserver",
                type: "article",
                url: "http://arxiv-sanity.com/",
                duration: 20,
              },
              {
                title: "Reproducible Research in Computational Science",
                type: "article",
                url: "https://www.science.org/doi/10.1126/science.1213847",
                duration: 30,
              },
            ],
            validationCriteria: [
              "Rédiger un article de recherche complet",
              "Effectuer une revue critique de littérature",
              "Concevoir et mener des expériences rigoureuses",
              "Présenter des résultats à une conférence",
            ],
          },
          {
            title: "Domaines de Recherche Avancés",
            description:
              "Exploration des frontières actuelles de la recherche en IA",
            duration: 50,
            skills: [
              { name: "Research frontiers", level: "advanced" },
              { name: "Novel algorithms", level: "advanced" },
              { name: "Innovation", level: "advanced" },
            ],
            resources: [
              {
                title: "NIPS/NeurIPS Papers Collection",
                type: "article",
                url: "https://papers.nips.cc/",
                duration: 200,
              },
              {
                title: "ICML Papers",
                type: "article",
                url: "https://icml.cc/",
                duration: 200,
              },
              {
                title: "ICLR Papers",
                type: "article",
                url: "https://iclr.cc/",
                duration: 200,
              },
              {
                title: "Distill.pub - Interactive ML Explanations",
                type: "article",
                url: "https://distill.pub/",
                duration: 100,
              },
              {
                title: "The morning paper - AI Research Blog",
                type: "article",
                url: "https://blog.acolyer.org/",
                duration: 80,
              },
            ],
            validationCriteria: [
              "Identifier et formuler un problème de recherche original",
              "Développer une approche novatrice",
              "Obtenir des résultats significatifs",
              "Publier dans une conférence de premier plan",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "Chercheur en IA (CNRS, INRIA)",
            description: "Recherche fondamentale en intelligence artificielle",
            averageSalary: "35-60k€/an (France), 80-150k€/an (International)",
            companies: [
              "CNRS",
              "INRIA",
              "Google Research",
              "DeepMind",
              "OpenAI",
            ],
          },
          {
            title: "Professeur-Chercheur",
            description: "Enseignement et recherche en université",
            averageSalary: "40-70k€/an",
            companies: ["Universités", "Grandes Écoles", "MIT", "Stanford"],
          },
        ],
        certification: {
          available: true,
          name: "Certificat de Recherche en IA",
          provider: "UCAD AI Research Center",
          url: "https://ucad.sn/certifications/ai-researcher",
        },
        requiredConcepts: [],
      },

      {
        title: "Spécialiste IA Générative",
        description:
          "Expert en modèles génératifs: GANs, VAEs, Diffusion Models",
        category: "dl",
        level: "advanced",
        estimatedDuration: 18,
        prerequisites: [
          {
            category: "math",
            skills: [
              { name: "Probabilités", level: "advanced" },
              { name: "Optimisation", level: "advanced" },
            ],
          },
          {
            category: "theory",
            skills: [{ name: "Deep Learning", level: "advanced" }],
          },
        ],
        modules: [
          {
            title: "Generative Adversarial Networks",
            description: "Maîtrise complète des GANs et leurs applications",
            duration: 35,
            skills: [
              { name: "GAN architectures", level: "advanced" },
              { name: "Training stability", level: "advanced" },
              { name: "Evaluation metrics", level: "intermediate" },
            ],
            resources: [
              {
                title: "Generative Adversarial Networks - Goodfellow (Paper)",
                type: "article",
                url: "https://arxiv.org/abs/1406.2661",
                duration: 40,
              },
              {
                title: "NIPS 2016 Tutorial: Generative Adversarial Networks",
                type: "course",
                url: "https://arxiv.org/abs/1701.00160",
                duration: 120,
              },
              {
                title: "Progressive Growing of GANs",
                type: "article",
                url: "https://arxiv.org/abs/1710.10196",
                duration: 60,
              },
              {
                title: "StyleGAN Series Papers",
                type: "article",
                url: "https://arxiv.org/abs/1812.04948",
                duration: 100,
              },
              {
                title: "GAN Lab - Interactive Visualization",
                type: "course",
                url: "https://poloclub.github.io/ganlab/",
                duration: 60,
              },
              {
                title: "PyTorch GAN Tutorial",
                type: "course",
                url: "https://pytorch.org/tutorials/beginner/dcgan_faces_tutorial.html",
                duration: 80,
              },
            ],
            validationCriteria: [
              "Implémenter différentes architectures de GANs",
              "Diagnostiquer et résoudre l'instabilité d'entraînement",
              "Générer des images haute qualité",
              "Évaluer qualitativement et quantitativement les résultats",
            ],
          },
          {
            title: "Variational Autoencoders et Modèles Probabilistes",
            description: "VAEs et modèles génératifs probabilistes",
            duration: 30,
            skills: [
              { name: "VAE theory", level: "advanced" },
              { name: "Latent spaces", level: "advanced" },
              { name: "Probabilistic modeling", level: "advanced" },
            ],
            resources: [
              {
                title: "Auto-Encoding Variational Bayes - Kingma",
                type: "article",
                url: "https://arxiv.org/abs/1312.6114",
                duration: 50,
              },
              {
                title: "Tutorial on Variational Autoencoders - Doersch",
                type: "article",
                url: "https://arxiv.org/abs/1606.05908",
                duration: 80,
              },
              {
                title: "β-VAE: Learning Basic Visual Concepts",
                type: "article",
                url: "https://openreview.net/forum?id=Sy2fzU9gl",
                duration: 40,
              },
              {
                title: "VQ-VAE: Neural Discrete Representation Learning",
                type: "article",
                url: "https://arxiv.org/abs/1711.00937",
                duration: 60,
              },
              {
                title: "Variational Inference: A Review - Blei",
                type: "article",
                url: "https://arxiv.org/abs/1601.00670",
                duration: 100,
              },
            ],
            validationCriteria: [
              "Implémenter VAEs avec différentes architectures",
              "Comprendre le reparameterization trick",
              "Analyser et manipuler l'espace latent",
              "Appliquer VAEs à différents types de données",
            ],
          },
          {
            title: "Diffusion Models et Score-Based Generative Models",
            description: "Dernière génération de modèles génératifs",
            duration: 35,
            skills: [
              { name: "Diffusion processes", level: "advanced" },
              { name: "Score matching", level: "advanced" },
              { name: "Sampling techniques", level: "intermediate" },
            ],
            resources: [
              {
                title: "Denoising Diffusion Probabilistic Models - Ho",
                type: "article",
                url: "https://arxiv.org/abs/2006.11239",
                duration: 60,
              },
              {
                title: "Score-Based Generative Modeling - Song",
                type: "article",
                url: "https://arxiv.org/abs/2011.13456",
                duration: 80,
              },
              {
                title: "Diffusion Models Beat GANs - Dhariwal",
                type: "article",
                url: "https://arxiv.org/abs/2105.05233",
                duration: 50,
              },
              {
                title: "High-Resolution Image Synthesis with Latent Diffusion",
                type: "article",
                url: "https://arxiv.org/abs/2112.10752",
                duration: 70,
              },
              {
                title: "What are Diffusion Models? - Lilian Weng Blog",
                type: "article",
                url: "https://lilianweng.github.io/posts/2021-07-11-diffusion-models/",
                duration: 60,
              },
            ],
            validationCriteria: [
              "Comprendre le processus forward et reverse",
              "Implémenter DDPM from scratch",
              "Optimiser la vitesse de sampling",
              "Adapter diffusion models à différents domaines",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "Research Scientist - Generative AI",
            description: "Recherche et développement en IA générative",
            averageSalary: "80-150k€/an",
            companies: ["OpenAI", "Midjourney", "Stability AI", "Anthropic"],
          },
          {
            title: "Creative AI Engineer",
            description: "Applications créatives de l'IA générative",
            averageSalary: "60-120k€/an",
            companies: ["Adobe", "NVIDIA", "Runway ML", "Synthesis AI"],
          },
        ],
        certification: {
          available: true,
          name: "Generative AI Specialist Certificate",
          provider: "UCAD AI Center",
          url: "https://ucad.sn/certifications/generative-ai",
        },
        requiredConcepts: [],
      },

      {
        title: "Expert en IA pour l'Afrique",
        description:
          "Spécialisation IA adaptée aux défis et opportunités africains",
        category: "ml",
        level: "intermediate",
        estimatedDuration: 15,
        prerequisites: [
          {
            category: "math",
            skills: [
              { name: "Statistiques", level: "intermediate" },
              { name: "Probabilités", level: "intermediate" },
            ],
          },
          {
            category: "programming",
            skills: [{ name: "Python", level: "intermediate" }],
          },
        ],
        modules: [
          {
            title: "IA pour les Langues Africaines",
            description: "NLP et technologies linguistiques pour l'Afrique",
            duration: 25,
            skills: [
              { name: "Multilingual NLP", level: "intermediate" },
              { name: "Low-resource languages", level: "intermediate" },
              { name: "Cross-lingual models", level: "intermediate" },
            ],
            resources: [
              {
                title: "Masakhane - NLP for African Languages",
                type: "article",
                url: "https://www.masakhane.io/",
                duration: 60,
              },
              {
                title: "AfroNLP: A Toolkit for African Languages",
                type: "article",
                url: "https://arxiv.org/abs/2003.07008",
                duration: 40,
              },
              {
                title: "Low-Resource Languages: A Review - Hedderich",
                type: "article",
                url: "https://arxiv.org/abs/2006.07264",
                duration: 80,
              },
              {
                title: "Cross-lingual Language Model Pretraining",
                type: "article",
                url: "https://arxiv.org/abs/1901.07291",
                duration: 60,
              },
              {
                title: "JoeyNMT: Neural Machine Translation Toolkit",
                type: "course",
                url: "https://joeynmt.readthedocs.io/",
                duration: 100,
              },
              {
                title: "OPUS: Collection of Translated Texts",
                type: "article",
                url: "http://opus.nlpl.eu/",
                duration: 30,
              },
            ],
            validationCriteria: [
              "Développer un système NLP pour une langue africaine",
              "Créer un corpus aligné multilingue",
              "Implémenter un système de traduction automatique",
              "Évaluer les performances cross-linguales",
            ],
          },
          {
            title: "IA pour l'Agriculture et l'Environnement",
            description:
              "Applications IA pour l'agriculture intelligente africaine",
            duration: 20,
            skills: [
              { name: "Remote sensing", level: "intermediate" },
              { name: "Time series analysis", level: "intermediate" },
              { name: "Agricultural AI", level: "intermediate" },
            ],
            resources: [
              {
                title: "Deep Learning for Crop Yield Prediction",
                type: "article",
                url: "https://www.nature.com/articles/s41467-017-00906-4",
                duration: 50,
              },
              {
                title: "PlantNet: Plant Identification App",
                type: "article",
                url: "https://plantnet.org/",
                duration: 30,
              },
              {
                title: "Google Earth Engine for Agriculture",
                type: "course",
                url: "https://developers.google.com/earth-engine/tutorials/tutorials",
                duration: 120,
              },
              {
                title: "Climate Change AI - Agriculture Track",
                type: "article",
                url: "https://www.climatechange.ai/papers?track=Agriculture",
                duration: 80,
              },
              {
                title: "GFDRR Labs - AI for Disaster Risk Management",
                type: "article",
                url: "https://www.gfdrr.org/en/gfdrr-labs",
                duration: 60,
              },
            ],
            validationCriteria: [
              "Analyser des images satellites pour monitoring agricole",
              "Prédire les rendements avec des données météo",
              "Développer une app d'identification de maladies",
              "Créer un système d'alerte précoce climatique",
            ],
          },
          {
            title: "IA pour la Santé en Afrique",
            description: "Solutions IA adaptées aux défis sanitaires africains",
            duration: 25,
            skills: [
              { name: "Medical AI", level: "intermediate" },
              { name: "Diagnostic assistance", level: "intermediate" },
              { name: "Epidemiology", level: "basic" },
            ],
            resources: [
              {
                title: "AI for Social Good: Healthcare in Africa",
                type: "article",
                url: "https://ai4sg.org/healthcare/",
                duration: 60,
              },
              {
                title: "Deep Learning for Medical Image Analysis",
                type: "book",
                url: "https://www.elsevier.com/books/deep-learning-for-medical-image-analysis/zhou/978-0-12-810408-8",
                duration: 200,
              },
              {
                title: "Retinal Fundus Multi-Disease Image Dataset",
                type: "article",
                url: "https://odir2019.grand-challenge.org/",
                duration: 40,
              },
              {
                title: "mHealth: Mobile Health Technologies",
                type: "article",
                url: "https://mhealth.jmir.org/",
                duration: 80,
              },
              {
                title: "Partners In Health - Digital Health",
                type: "article",
                url: "https://www.pih.org/pages/digital-health",
                duration: 50,
              },
            ],
            validationCriteria: [
              "Développer un système de diagnostic par image",
              "Analyser des données épidémiologiques",
              "Créer une application mobile de santé",
              "Évaluer l'impact sociétal des solutions",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "AI for Good Specialist",
            description: "Solutions IA pour les défis sociétaux africains",
            averageSalary: "35-65k€/an",
            companies: [
              "ONG",
              "Organisations Internationales",
              "Startups Impact",
            ],
          },
          {
            title: "AgTech AI Engineer",
            description: "IA pour l'agriculture intelligente",
            averageSalary: "40-70k€/an",
            companies: ["Startups AgTech", "FAO", "CGIAR"],
          },
        ],
        certification: {
          available: true,
          name: "AI for Africa Certificate",
          provider: "UCAD AI Center",
          url: "https://ucad.sn/certifications/ai-africa",
        },
        requiredConcepts: [],
      },

      {
        title: "Architecte de Systèmes IA",
        description:
          "Conception et architecture de systèmes IA complexes à grande échelle",
        category: "mlops",
        level: "advanced",
        estimatedDuration: 20,
        prerequisites: [
          {
            category: "programming",
            skills: [
              { name: "Systèmes distribués", level: "intermediate" },
              { name: "Cloud computing", level: "intermediate" },
              { name: "DevOps", level: "intermediate" },
            ],
          },
          {
            category: "theory",
            skills: [{ name: "Machine Learning", level: "advanced" }],
          },
        ],
        modules: [
          {
            title: "Architecture de Systèmes ML Distribués",
            description: "Conception de systèmes ML scalables et résilients",
            duration: 30,
            skills: [
              { name: "Distributed ML", level: "advanced" },
              { name: "System design", level: "advanced" },
              { name: "Scalability", level: "advanced" },
            ],
            resources: [
              {
                title: "Designing Machine Learning Systems - Chip Huyen",
                type: "book",
                url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/",
                duration: 250,
              },
              {
                title: "Building ML Systems at Scale - Berkeley Course",
                type: "course",
                url: "https://ucbrise.github.io/cs294-ai-sys-sp19/",
                duration: 180,
              },
              {
                title: "Ray: Distributed AI Framework",
                type: "course",
                url: "https://docs.ray.io/en/latest/",
                duration: 120,
              },
              {
                title: "Horovod: Distributed Deep Learning",
                type: "article",
                url: "https://horovod.readthedocs.io/",
                duration: 80,
              },
              {
                title: "TensorFlow Extended (TFX)",
                type: "course",
                url: "https://www.tensorflow.org/tfx",
                duration: 100,
              },
            ],
            validationCriteria: [
              "Concevoir une architecture ML distribuée",
              "Implémenter un pipeline ML scalable",
              "Optimiser les performances système",
              "Gérer la tolérance aux pannes",
            ],
          },
          {
            title: "MLOps et Ingénierie de Platform",
            description: "Construction de plateformes ML robustes",
            duration: 35,
            skills: [
              { name: "Platform engineering", level: "advanced" },
              { name: "Infrastructure as Code", level: "advanced" },
              { name: "Observability", level: "advanced" },
            ],
            resources: [
              {
                title: "Kubeflow: ML Workflows on Kubernetes",
                type: "course",
                url: "https://www.kubeflow.org/docs/",
                duration: 150,
              },
              {
                title: "MLflow: ML Lifecycle Management",
                type: "course",
                url: "https://mlflow.org/docs/latest/index.html",
                duration: 100,
              },
              {
                title: "Terraform for Infrastructure",
                type: "course",
                url: "https://learn.hashicorp.com/terraform",
                duration: 120,
              },
              {
                title: "Prometheus + Grafana for ML Monitoring",
                type: "course",
                url: "https://prometheus.io/docs/introduction/overview/",
                duration: 80,
              },
              {
                title: "Apache Airflow for ML Pipelines",
                type: "course",
                url: "https://airflow.apache.org/docs/",
                duration: 100,
              },
            ],
            validationCriteria: [
              "Déployer une plateforme MLOps complète",
              "Automatiser les pipelines CI/CD ML",
              "Implémenter monitoring et alerting",
              "Gérer la gouvernance des modèles",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "ML Platform Engineer",
            description: "Construction de plateformes ML d'entreprise",
            averageSalary: "70-130k€/an",
            companies: ["Google", "Meta", "Netflix", "Uber"],
          },
          {
            title: "Solutions Architect - AI",
            description: "Architecture de solutions IA pour clients",
            averageSalary: "80-150k€/an",
            companies: ["AWS", "Microsoft", "Google Cloud", "IBM"],
          },
        ],
        certification: {
          available: true,
          name: "AI Systems Architect Certificate",
          provider: "UCAD AI Center",
          url: "https://ucad.sn/certifications/ai-architect",
        },
        requiredConcepts: [],
      },
    ];

    for (const goalData of additionalGoals) {
      const goal = new Goal(goalData);
      await goal.save();
      logger.info(`Additional goal created: ${goalData.title}`);
    }
  } catch (error) {
    logger.error("Error creating additional goals:", error);
  }
}

async function createAdvancedAssessments() {
  try {
    const advancedAssessments = [
      {
        title: "Évaluation Recherche en IA",
        category: "ml",
        difficulty: "advanced",
        questions: [
          {
            text: "Dans la théorie PAC-learning, que représente la complexité d'échantillonnage ε-δ ?",
            options: [
              {
                text: "Le nombre minimum d'exemples pour apprendre avec erreur ≤ ε et probabilité ≥ 1-δ",
                isCorrect: true,
              },
              {
                text: "La complexité computationnelle de l'algorithme",
                isCorrect: false,
              },
              {
                text: "La dimension VC de l'espace d'hypothèses",
                isCorrect: false,
              },
              {
                text: "L'erreur de généralisation empirique",
                isCorrect: false,
              },
            ],
            explanation:
              "La complexité d'échantillonnage détermine combien d'exemples sont nécessaires pour que l'algorithme trouve une hypothèse avec erreur vraie ≤ ε avec probabilité ≥ 1-δ.",
          },
          {
            text: "Quelle inégalité de concentration est utilisée pour borner l'erreur de généralisation ?",
            options: [
              {
                text: "Inégalité de Hoeffding pour borner |R(h) - R_emp(h)|",
                isCorrect: true,
              },
              { text: "Inégalité de Jensen", isCorrect: false },
              { text: "Inégalité de Cauchy-Schwarz", isCorrect: false },
              { text: "Inégalité de Markov", isCorrect: false },
            ],
            explanation:
              "L'inégalité de Hoeffding permet de borner la différence entre risque vrai et empirique avec haute probabilité.",
          },
          {
            text: "Dans un GAN, que mesure la divergence de Jensen-Shannon entre distributions ?",
            options: [
              {
                text: "La distance entre la distribution réelle et générée, symétrique et bornée",
                isCorrect: true,
              },
              {
                text: "La fonction de loss du discriminateur uniquement",
                isCorrect: false,
              },
              {
                text: "L'entropie conditionnelle du générateur",
                isCorrect: false,
              },
              {
                text: "La complexité de Kolmogorov des données",
                isCorrect: false,
              },
            ],
            explanation:
              "JS divergence = 1/2 * [KL(P||M) + KL(Q||M)] où M=(P+Q)/2, elle est symétrique et bornée par log(2).",
          },
        ],
        recommendedGoals: [],
      },

      {
        title: "Évaluation IA Générative Avancée",
        category: "dl",
        difficulty: "advanced",
        questions: [
          {
            text: "Dans un VAE, pourquoi utilise-t-on le reparameterization trick z = μ + σ ⊙ ε ?",
            options: [
              {
                text: "Permettre la backpropagation à travers l'échantillonnage stochastique",
                isCorrect: true,
              },
              { text: "Accélérer l'entraînement du modèle", isCorrect: false },
              {
                text: "Réduire la dimension de l'espace latent",
                isCorrect: false,
              },
              {
                text: "Améliorer la qualité de reconstruction",
                isCorrect: false,
              },
            ],
            explanation:
              "Le trick rend l'échantillonnage différentiable en déplaçant la stochasticité vers ε ~ N(0,I).",
          },
          {
            text: "Quelle est la principale innovation des Diffusion Models par rapport aux GANs ?",
            options: [
              {
                text: "Processus génératif par débruitage itératif stable vs adversarial",
                isCorrect: true,
              },
              { text: "Vitesse de génération plus rapide", isCorrect: false },
              { text: "Moins de paramètres nécessaires", isCorrect: false },
              {
                text: "Meilleure qualité d'image uniquement",
                isCorrect: false,
              },
            ],
            explanation:
              "Les diffusion models évitent l'instabilité adversariale en utilisant un processus de débruitage déterministe.",
          },
          {
            text: "Dans DDPM, que modélise le réseau de neurones ε_θ(x_t, t) ?",
            options: [
              {
                text: "Le bruit ajouté à l'étape t pour prédire la direction de débruitage",
                isCorrect: true,
              },
              { text: "L'image finale débruitée", isCorrect: false },
              { text: "La probabilité de transition", isCorrect: false },
              { text: "La fonction de score ∇log p(x)", isCorrect: false },
            ],
            explanation:
              "ε_θ prédit le bruit ε qui a été ajouté, permettant de calculer x_{t-1} à partir de x_t.",
          },
        ],
        recommendedGoals: [],
      },

      {
        title: "Évaluation IA pour l'Afrique",
        category: "ml",
        difficulty: "intermediate",
        questions: [
          {
            text: "Quel défi principal pour le NLP en langues africaines ?",
            options: [
              {
                text: "Manque de données annotées et diversité linguistique (2000+ langues)",
                isCorrect: true,
              },
              { text: "Algorithmes inappropriés", isCorrect: false },
              { text: "Manque de puissance de calcul", isCorrect: false },
              {
                text: "Structures grammaticales trop complexes",
                isCorrect: false,
              },
            ],
            explanation:
              "L'Afrique a plus de 2000 langues avec très peu de ressources numériques et de corpus annotés.",
          },
          {
            text: "Comment adapter l'IA agricole aux petits exploitants africains ?",
            options: [
              {
                text: "Solutions mobile-first, offline, low-cost avec connaissances locales",
                isCorrect: true,
              },
              {
                text: "Imposer des technologies occidentales",
                isCorrect: false,
              },
              {
                text: "Se concentrer uniquement sur les grandes exploitations",
                isCorrect: false,
              },
              {
                text: "Ignorer les pratiques traditionnelles",
                isCorrect: false,
              },
            ],
            explanation:
              "Les solutions doivent être accessibles, fonctionner hors ligne, et intégrer les savoirs locaux.",
          },
          {
            text: "Quelle approche pour l'IA médicale dans les zones rurales africaines ?",
            options: [
              {
                text: "Diagnostic par smartphone, télémédecine, et formation des agents communautaires",
                isCorrect: true,
              },
              { text: "Installation d'équipements coûteux", isCorrect: false },
              {
                text: "Remplacement complet du personnel médical",
                isCorrect: false,
              },
              { text: "Solutions uniquement urbaines", isCorrect: false },
            ],
            explanation:
              "L'IA doit augmenter les capacités locales avec des outils simples et accessibles.",
          },
        ],
        recommendedGoals: [],
      },
    ];

    for (const assessmentData of advancedAssessments) {
      const assessment = new Assessment(assessmentData);
      await assessment.save();
      logger.info(`Advanced assessment created: ${assessmentData.title}`);
    }
  } catch (error) {
    logger.error("Error creating advanced assessments:", error);
  }
}

async function createAdditionalUsers() {
  try {
    const additionalUsers = [
      // Étudiants supplémentaires
      {
        email: "amina.diallo@ucad.edu.sn",
        password: "Amina123!",
        role: "user",
      },
      {
        email: "cheikh.sy@ucad.edu.sn",
        password: "Cheikh123!",
        role: "user",
      },
      {
        email: "khadija.fall@ucad.edu.sn",
        password: "Khadija123!",
        role: "user",
      },
      {
        email: "moussa.diop@ucad.edu.sn",
        password: "Moussa123!",
        role: "user",
      },
      {
        email: "rama.ndiaye@ucad.edu.sn",
        password: "Rama123!",
        role: "user",
      },
      {
        email: "alpha.ba@ucad.edu.sn",
        password: "Alpha123!",
        role: "user",
      },
      {
        email: "seynabou.sow@ucad.edu.sn",
        password: "Seynabou123!",
        role: "user",
      },
      {
        email: "modou.kane@ucad.edu.sn",
        password: "Modou123!",
        role: "user",
      },
      {
        email: "bineta.diop@ucad.edu.sn",
        password: "Bineta123!",
        role: "user",
      },
      {
        email: "lamine.fall@ucad.edu.sn",
        password: "Lamine123!",
        role: "user",
      },
      // Professeurs supplémentaires
      {
        email: "prof.sarr@ucad.edu.sn",
        password: "ProfSarr123!",
        role: "admin",
      },
      {
        email: "prof.diouf@ucad.edu.sn",
        password: "ProfDiouf123!",
        role: "admin",
      },
      {
        email: "dr.wade@ucad.edu.sn",
        password: "DrWade123!",
        role: "admin",
      },
    ];

    for (const userData of additionalUsers) {
      const user = new User(userData);
      await user.save();
      logger.info(`Additional user created: ${userData.email}`);
    }
  } catch (error) {
    logger.error("Error creating additional users:", error);
  }
}

async function createAdvancedProfiles() {
  try {
    const users = await User.find({ role: "user" });
    const goals = await Goal.find();

    if (users.length < 4) {
      logger.warn("Not enough users for advanced profiles");
      return;
    }

    const advancedProfiles = [
      // Profil recherche académique
      {
        userId: users[3]._id,
        learningStyle: "reading",
        preferences: {
          mathLevel: "advanced",
          programmingLevel: "advanced",
          preferredDomain: "ml",
        },
        assessments: [
          {
            category: "ml",
            score: 90,
            responses: [
              {
                questionId: "research_pac_1",
                selectedOption:
                  "Le nombre minimum d'exemples pour apprendre avec erreur ≤ ε et probabilité ≥ 1-δ",
                timeSpent: 90,
                category: "ml",
                difficulty: "advanced",
              },
            ],
            recommendations: [
              {
                category: "ml",
                score: 90,
                recommendations: [
                  "Explorer les frontières de la recherche en IA",
                  "Développer des compétences en rédaction scientifique",
                  "Participer à des projets de recherche collaboratifs",
                ],
              },
            ],
            completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
        ],
        goal:
          goals.find(g => g.title === "Chercheur en IA")?._id || goals[0]._id,
      },

      // Profil IA générative
      {
        userId: users[4]._id,
        learningStyle: "kinesthetic",
        preferences: {
          mathLevel: "advanced",
          programmingLevel: "advanced",
          preferredDomain: "dl",
        },
        assessments: [
          {
            category: "dl",
            score: 85,
            responses: [
              {
                questionId: "gen_ai_vae_1",
                selectedOption:
                  "Permettre la backpropagation à travers l'échantillonnage stochastique",
                timeSpent: 60,
                category: "dl",
                difficulty: "advanced",
              },
            ],
            recommendations: [
              {
                category: "dl",
                score: 85,
                recommendations: [
                  "Maîtriser les dernières architectures génératives",
                  "Pratiquer l'implémentation from scratch",
                  "Explorer les applications créatives",
                ],
              },
            ],
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
        goal:
          goals.find(g => g.title === "Spécialiste IA Générative")?._id ||
          goals[1]._id,
      },

      // Profil IA pour l'Afrique
      {
        userId: users[5]._id,
        learningStyle: "visual",
        preferences: {
          mathLevel: "intermediate",
          programmingLevel: "intermediate",
          preferredDomain: "ml",
        },
        assessments: [
          {
            category: "ml",
            score: 75,
            responses: [
              {
                questionId: "africa_ai_nlp_1",
                selectedOption:
                  "Manque de données annotées et diversité linguistique (2000+ langues)",
                timeSpent: 45,
                category: "ml",
                difficulty: "intermediate",
              },
            ],
            recommendations: [
              {
                category: "ml",
                score: 75,
                recommendations: [
                  "Se spécialiser dans les solutions contextuelles",
                  "Comprendre les enjeux socio-économiques",
                  "Développer des solutions durables",
                ],
              },
            ],
            completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          },
        ],
        goal:
          goals.find(g => g.title === "Expert en IA pour l'Afrique")?._id ||
          goals[0]._id,
      },

      // Profil architecture systèmes
      {
        userId: users[6]._id,
        learningStyle: "reading",
        preferences: {
          mathLevel: "intermediate",
          programmingLevel: "advanced",
          preferredDomain: "mlops",
        },
        assessments: [
          {
            category: "mlops",
            score: 80,
            responses: [
              {
                questionId: "mlops_arch_1",
                selectedOption:
                  "Pipeline robuste avec tests, monitoring, et documentation technique détaillée",
                timeSpent: 55,
                category: "mlops",
                difficulty: "advanced",
              },
            ],
            recommendations: [
              {
                category: "mlops",
                score: 80,
                recommendations: [
                  "Maîtriser les architectures cloud-native",
                  "Approfondir l'observabilité des systèmes",
                  "Développer l'expertise en infrastructure as code",
                ],
              },
            ],
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
        ],
        goal:
          goals.find(g => g.title === "Architecte de Systèmes IA")?._id ||
          goals[0]._id,
      },
    ];

    for (const profileData of advancedProfiles) {
      const profile = new LearnerProfile(profileData);
      await profile.save();
      logger.info(`Advanced profile created for user: ${profileData.userId}`);
    }
  } catch (error) {
    logger.error("Error creating advanced profiles:", error);
  }
}

async function createAdvancedPathways() {
  try {
    const users = await User.find({ role: "user" });
    const goals = await Goal.find();

    if (users.length < 7) {
      logger.warn("Not enough users for advanced pathways");
      return;
    }

    const advancedPathways = [
      // Pathway recherche - débutant enthousiaste
      {
        userId: users[3]._id,
        goalId:
          goals.find(g => g.title === "Chercheur en IA")?._id || goals[0]._id,
        status: "active",
        progress: 15,
        currentModule: 0,
        moduleProgress: [
          {
            moduleIndex: 0,
            completed: false,
            locked: false,
            resources: [
              {
                resourceId: "understanding_ml_book",
                completed: true,
                completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
              {
                resourceId: "elements_stat_learning",
                completed: false,
                completedAt: null,
              },
            ],
            quiz: {
              completed: false,
              score: 0,
              completedAt: null,
            },
          },
        ],
        startedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        lastAccessedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        estimatedCompletionDate: new Date(
          Date.now() + 180 * 24 * 60 * 60 * 1000
        ),
        adaptiveRecommendations: [
          {
            type: "practice",
            description: "Commencer à lire des papers récents sur arXiv",
            priority: "high",
            status: "pending",
          },
          {
            type: "resource",
            description: "Rejoindre une communauté de recherche en ligne",
            priority: "medium",
            status: "pending",
          },
        ],
        nextGoals: [],
      },

      // Pathway IA générative - progression rapide
      {
        userId: users[4]._id,
        goalId:
          goals.find(g => g.title === "Spécialiste IA Générative")?._id ||
          goals[1]._id,
        status: "active",
        progress: 45,
        currentModule: 1,
        moduleProgress: [
          {
            moduleIndex: 0,
            completed: true,
            locked: false,
            resources: [
              {
                resourceId: "gan_goodfellow_paper",
                completed: true,
                completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
              },
              {
                resourceId: "gan_tutorial_nips",
                completed: true,
                completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
              },
            ],
            quiz: {
              completed: true,
              score: 85,
              completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          {
            moduleIndex: 1,
            completed: false,
            locked: false,
            resources: [
              {
                resourceId: "vae_kingma_paper",
                completed: true,
                completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              },
              {
                resourceId: "vae_tutorial_doersch",
                completed: false,
                completedAt: null,
              },
            ],
            quiz: {
              completed: false,
              score: 0,
              completedAt: null,
            },
          },
        ],
        startedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        lastAccessedAt: new Date(Date.now() - 30 * 60 * 1000),
        estimatedCompletionDate: new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000
        ),
        adaptiveRecommendations: [
          {
            type: "practice",
            description: "Implémenter un VAE β avec différentes valeurs de β",
            priority: "high",
            status: "pending",
          },
          {
            type: "resource",
            description: "Explorer les VAE conditionnels",
            priority: "medium",
            status: "pending",
          },
        ],
        nextGoals: [],
      },

      // Pathway IA pour l'Afrique - focus impact social
      {
        userId: users[5]._id,
        goalId:
          goals.find(g => g.title === "Expert en IA pour l'Afrique")?._id ||
          goals[0]._id,
        status: "active",
        progress: 30,
        currentModule: 0,
        moduleProgress: [
          {
            moduleIndex: 0,
            completed: false,
            locked: false,
            resources: [
              {
                resourceId: "masakhane_project",
                completed: true,
                completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              },
              {
                resourceId: "afronlp_toolkit",
                completed: true,
                completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              },
              {
                resourceId: "low_resource_review",
                completed: false,
                completedAt: null,
              },
            ],
            quiz: {
              completed: false,
              score: 0,
              completedAt: null,
            },
          },
        ],
        startedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        lastAccessedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        estimatedCompletionDate: new Date(
          Date.now() + 75 * 24 * 60 * 60 * 1000
        ),
        adaptiveRecommendations: [
          {
            type: "practice",
            description:
              "Contribuer au projet Masakhane avec une langue locale",
            priority: "high",
            status: "pending",
          },
          {
            type: "resource",
            description: "Étudier les applications IA dans votre région",
            priority: "medium",
            status: "pending",
          },
        ],
        nextGoals: [],
      },
    ];

    for (const pathwayData of advancedPathways) {
      const pathway = new Pathway(pathwayData);
      await pathway.save();
      logger.info(`Advanced pathway created for user: ${pathwayData.userId}`);
    }
  } catch (error) {
    logger.error("Error creating advanced pathways:", error);
  }
}

async function augmentDatabase() {
  try {
    await connectDB();

    logger.info("Starting database augmentation with educational resources...");

    await createAdditionalUsers();
    await createAdditionalConcepts();
    await createAdditionalGoals();
    await createAdvancedAssessments();
    await createAdvancedProfiles();
    await createAdvancedPathways();

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

    logger.info("\n=== 📚 DATABASE AUGMENTATION COMPLETED ===");
    logger.info(`👥 Total Users: ${stats.users}`);
    logger.info(`🧠 Total Concepts: ${stats.concepts}`);
    logger.info(`🎯 Total Learning Goals: ${stats.goals}`);
    logger.info(`📊 Total Assessments: ${stats.assessments}`);
    logger.info(`📝 Total Quizzes: ${stats.quizzes}`);
    logger.info(`👤 Total Learner Profiles: ${stats.profiles}`);
    logger.info(`🛤️  Total Learning Pathways: ${stats.pathways}`);
    logger.info(
      "\n✅ Enhanced UCAD IA Learning Platform ready with rich educational content!"
    );
    logger.info(
      "🌍 Focus: Free educational resources and African AI applications"
    );
  } catch (error) {
    logger.error("Error during database augmentation:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

async function createSpecializedQuizzes() {
  try {
    const goals = await Goal.find();

    // Créer des quiz spécialisés pour les nouveaux goals
    const specializedQuizTemplates = {
      "Fondements Théoriques de l'IA": [
        {
          text: "Selon le livre 'Understanding Machine Learning', quelle est la relation entre la dimension VC et la complexité d'échantillonnage ?",
          options: [
            {
              text: "Plus la dimension VC est élevée, plus il faut d'exemples pour garantir la généralisation",
              isCorrect: true,
            },
            {
              text: "La dimension VC n'affecte pas le nombre d'exemples nécessaires",
              isCorrect: false,
            },
            {
              text: "Une dimension VC élevée améliore toujours la généralisation",
              isCorrect: false,
            },
            {
              text: "La dimension VC ne s'applique qu'aux algorithmes non-paramétriques",
              isCorrect: false,
            },
          ],
          explanation:
            "La borne PAC montre que la complexité d'échantillonnage croît avec la dimension VC de la classe d'hypothèses.",
        },
        {
          text: "Dans 'The Elements of Statistical Learning', comment le biais et la variance contribuent-ils à l'erreur de prédiction ?",
          options: [
            {
              text: "Erreur = Biais² + Variance + Bruit irréductible (décomposition biais-variance)",
              isCorrect: true,
            },
            {
              text: "Erreur = Biais + Variance",
              isCorrect: false,
            },
            {
              text: "Erreur = max(Biais, Variance)",
              isCorrect: false,
            },
            {
              text: "Biais et variance sont indépendants de l'erreur",
              isCorrect: false,
            },
          ],
          explanation:
            "La décomposition biais-variance montre que l'erreur expected se décompose en trois termes : biais au carré, variance, et bruit irréductible.",
        },
        {
          text: "D'après MacKay's 'Information Theory, Inference, and Learning', que représente l'entropie croisée en ML ?",
          options: [
            {
              text: "Mesure de dissimilarité entre deux distributions, utilisée comme loss function",
              isCorrect: true,
            },
            {
              text: "L'entropie du dataset d'entraînement",
              isCorrect: false,
            },
            {
              text: "La capacité maximale d'un canal de communication",
              isCorrect: false,
            },
            {
              text: "Le nombre de bits nécessaires pour encoder les labels",
              isCorrect: false,
            },
          ],
          explanation:
            "L'entropie croisée H(p,q) = -Σ p(x)log q(x) mesure le coût d'encodage de p avec le code optimal pour q.",
        },
        {
          text: "Selon les 'Foundations of Machine Learning' de Mohri, qu'est-ce que la complexité de Rademacher ?",
          options: [
            {
              text: "Mesure de la capacité d'une classe de fonctions à s'adapter au bruit aléatoire",
              isCorrect: true,
            },
            {
              text: "La complexité computationnelle de l'entraînement",
              isCorrect: false,
            },
            {
              text: "Le nombre de paramètres dans le modèle",
              isCorrect: false,
            },
            {
              text: "La profondeur maximale des arbres de décision",
              isCorrect: false,
            },
          ],
          explanation:
            "La complexité de Rademacher mesure à quel point une classe de fonctions peut corréler avec du bruit uniforme ±1.",
        },
        {
          text: "En utilisant les concentration inequalities de Boucheron, comment borner P(|X - E[X]| ≥ t) pour une variable bornée ?",
          options: [
            {
              text: "Inégalité de Hoeffding : P(|X - E[X]| ≥ t) ≤ 2exp(-2nt²/(b-a)²)",
              isCorrect: true,
            },
            {
              text: "Inégalité de Markov : P(|X| ≥ t) ≤ E[|X|]/t",
              isCorrect: false,
            },
            {
              text: "Inégalité de Chebyshev : P(|X - μ| ≥ t) ≤ σ²/t²",
              isCorrect: false,
            },
            {
              text: "Borne triviale : P(|X - E[X]| ≥ t) ≤ 1",
              isCorrect: false,
            },
          ],
          explanation:
            "Pour des variables indépendantes bornées dans [a,b], Hoeffding donne une décroissance exponentielle en t².",
        },
      ],

      "Méthodologie de Recherche": [
        {
          text: "Selon 'The Craft of Research', quelle est la structure optimale d'un article de recherche en ML ?",
          options: [
            {
              text: "Problème → Littérature → Contribution → Méthode → Expériences → Discussion → Conclusion",
              isCorrect: true,
            },
            {
              text: "Introduction → Méthode → Résultats → Conclusion",
              isCorrect: false,
            },
            {
              text: "Abstract → Code → Benchmarks → Future work",
              isCorrect: false,
            },
            {
              text: "Motivation → Solution → Evaluation",
              isCorrect: false,
            },
          ],
          explanation:
            "La structure argumentative doit clairement établir le problème, positionner la contribution, puis valider rigoureusement.",
        },
        {
          text: "D'après 'Writing for Computer Science', comment présenter des résultats expérimentaux en ML ?",
          options: [
            {
              text: "Protocole → Métriques → Baselines → Résultats → Analyse statistique → Discussion",
              isCorrect: true,
            },
            {
              text: "Seulement les meilleurs résultats",
              isCorrect: false,
            },
            {
              text: "Tous les résultats sans analyse",
              isCorrect: false,
            },
            {
              text: "Comparaison avec un seul baseline",
              isCorrect: false,
            },
          ],
          explanation:
            "La présentation doit être complète, reproductible, et inclure une analyse statistique rigoureuse.",
        },
        {
          text: "Pour la reproductibilité en ML, quels éléments sont critiques selon les standards de recherche ?",
          options: [
            {
              text: "Code + données + hyperparamètres + seeds + environnement + procédure complète",
              isCorrect: true,
            },
            {
              text: "Seulement le code final",
              isCorrect: false,
            },
            {
              text: "Description textuelle de l'algorithme",
              isCorrect: false,
            },
            {
              text: "Résultats numériques uniquement",
              isCorrect: false,
            },
          ],
          explanation:
            "La reproductibilité complète nécessite tous les éléments permettant de recréer exactement les expériences.",
        },
      ],

      "Generative Adversarial Networks": [
        {
          text: "Selon le paper original de Goodfellow, quel est l'objectif du générateur G dans un GAN ?",
          options: [
            {
              text: "min_G max_D V(D,G) = E_x[log D(x)] + E_z[log(1-D(G(z)))]",
              isCorrect: true,
            },
            {
              text: "Maximiser la probabilité des données réelles",
              isCorrect: false,
            },
            {
              text: "Minimiser la distance euclidienne aux données",
              isCorrect: false,
            },
            {
              text: "Maximiser l'entropie des générations",
              isCorrect: false,
            },
          ],
          explanation:
            "Le GAN résout un problème minimax où G cherche à tromper D qui essaie de distinguer vraies et fausses données.",
        },
        {
          text: "D'après Progressive Growing of GANs, pourquoi entraîner progressivement par résolution croissante ?",
          options: [
            {
              text: "Stabilité d'entraînement et génération de détails fins de manière hiérarchique",
              isCorrect: true,
            },
            {
              text: "Réduction du temps de calcul uniquement",
              isCorrect: false,
            },
            {
              text: "Diminution de la mémoire GPU",
              isCorrect: false,
            },
            {
              text: "Amélioration de la convergence théorique",
              isCorrect: false,
            },
          ],
          explanation:
            "L'entraînement progressif permet d'apprendre d'abord la structure globale puis les détails, évitant l'instabilité.",
        },
        {
          text: "Dans StyleGAN, que permet le style-based generator par rapport aux GANs classiques ?",
          options: [
            {
              text: "Contrôle disentangled des attributs via injection de style à différentes échelles",
              isCorrect: true,
            },
            {
              text: "Génération plus rapide uniquement",
              isCorrect: false,
            },
            {
              text: "Meilleure résolution d'image",
              isCorrect: false,
            },
            {
              text: "Entraînement plus stable seulement",
              isCorrect: false,
            },
          ],
          explanation:
            "StyleGAN sépare le contenu du style via AdaIN, permettant un contrôle fin des attributs générés.",
        },
        {
          text: "Pourquoi utiliser Spectral Normalization dans les GANs selon Miyato et al. ?",
          options: [
            {
              text: "Contrôler la constante de Lipschitz du discriminateur pour stabiliser l'entraînement",
              isCorrect: true,
            },
            {
              text: "Accélérer la convergence",
              isCorrect: false,
            },
            {
              text: "Réduire l'overfitting",
              isCorrect: false,
            },
            {
              text: "Améliorer la qualité d'image",
              isCorrect: false,
            },
          ],
          explanation:
            "SpectralNorm borne la norme spectrale des poids, garantissant que D est 1-Lipschitz pour la stabilité.",
        },
      ],

      "IA pour les Langues Africaines": [
        {
          text: "Selon le projet Masakhane, quel est le principal défi pour le NLP en langues africaines ?",
          options: [
            {
              text: "Manque de données parallèles et de ressources linguistiques numériques",
              isCorrect: true,
            },
            {
              text: "Complexité grammaticale supérieure",
              isCorrect: false,
            },
            {
              text: "Manque d'algorithmes adaptés",
              isCorrect: false,
            },
            {
              text: "Absence de locuteurs natifs",
              isCorrect: false,
            },
          ],
          explanation:
            "Most African languages lack digital resources, parallel corpora, and annotated datasets for NLP development.",
        },
        {
          text: "Comment AfroNLP aborde-t-il le problème des langues à faibles ressources ?",
          options: [
            {
              text: "Transfer learning multilingue + data augmentation + approches zero-shot",
              isCorrect: true,
            },
            {
              text: "Traduction automatique uniquement",
              isCorrect: false,
            },
            {
              text: "Création de nouveaux algorithmes spécifiques",
              isCorrect: false,
            },
            {
              text: "Collecte massive de données uniquement",
              isCorrect: false,
            },
          ],
          explanation:
            "AfroNLP combine transfer learning, augmentation de données, et méthodes zero-shot pour pallier le manque de ressources.",
        },
        {
          text: "Selon la recherche sur les langues à faibles ressources, quelle stratégie est la plus efficace ?",
          options: [
            {
              text: "Pre-training multilingue + fine-tuning avec données disponibles + knowledge distillation",
              isCorrect: true,
            },
            {
              text: "Entraînement from scratch pour chaque langue",
              isCorrect: false,
            },
            {
              text: "Utilisation exclusive de règles linguistiques",
              isCorrect: false,
            },
            {
              text: "Traduction vers l'anglais puis traitement",
              isCorrect: false,
            },
          ],
          explanation:
            "L'approche moderne combine des modèles pré-entraînés sur plusieurs langues avec du fine-tuning ciblé.",
        },
        {
          text: "Pour créer un corpus parallèle wolof-français, quelle approche recommande OPUS ?",
          options: [
            {
              text: "Alignement de documents + filtrage qualité + validation manuelle",
              isCorrect: true,
            },
            {
              text: "Traduction automatique bidirectionnelle",
              isCorrect: false,
            },
            {
              text: "Crowdsourcing sans validation",
              isCorrect: false,
            },
            {
              text: "Extraction automatique depuis le web",
              isCorrect: false,
            },
          ],
          explanation:
            "OPUS recommande un processus rigoureux d'alignement, filtrage et validation pour assurer la qualité.",
        },
      ],

      "IA pour l'Agriculture et l'Environnement": [
        {
          text: "Comment utiliser Google Earth Engine pour l'agriculture de précision en Afrique ?",
          options: [
            {
              text: "Analyse temporelle d'indices de végétation + classification d'usage des sols + prédiction de rendements",
              isCorrect: true,
            },
            {
              text: "Simple visualisation d'images satellites",
              isCorrect: false,
            },
            {
              text: "Comptage manuel de parcelles",
              isCorrect: false,
            },
            {
              text: "Prédiction météorologique uniquement",
              isCorrect: false,
            },
          ],
          explanation:
            "GEE permet l'analyse multi-temporelle d'indices comme NDVI pour monitor les cultures et prédire les rendements.",
        },
        {
          text: "Pour prédire les rendements agricoles avec du deep learning, quelles données combiner ?",
          options: [
            {
              text: "Images satellites + données météo + propriétés du sol + pratiques agricoles",
              isCorrect: true,
            },
            {
              text: "Images satellites uniquement",
              isCorrect: false,
            },
            {
              text: "Données historiques seulement",
              isCorrect: false,
            },
            {
              text: "Informations économiques uniquement",
              isCorrect: false,
            },
          ],
          explanation:
            "La prédiction précise nécessite une approche multimodale combinant observation satellitaire, météo, et données agronomiques.",
        },
        {
          text: "Selon Climate Change AI, comment l'IA peut-elle aider l'adaptation climatique en agriculture ?",
          options: [
            {
              text: "Early warning systems + crop recommendation + resource optimization + risk assessment",
              isCorrect: true,
            },
            {
              text: "Prédiction météorologique à long terme uniquement",
              isCorrect: false,
            },
            {
              text: "Automatisation complète des fermes",
              isCorrect: false,
            },
            {
              text: "Remplacement des agriculteurs",
              isCorrect: false,
            },
          ],
          explanation:
            "L'IA doit augmenter les capacités humaines avec des systèmes d'aide à la décision et d'optimisation des ressources.",
        },
      ],

      "Architecture de Systèmes ML Distribués": [
        {
          text: "Selon 'Designing Machine Learning Systems', comment gérer la dérive de données en production ?",
          options: [
            {
              text: "Monitoring statistique + tests de distribution + re-entraînement automatique + alerting",
              isCorrect: true,
            },
            {
              text: "Re-entraînement périodique fixe",
              isCorrect: false,
            },
            {
              text: "Ignorance de la dérive",
              isCorrect: false,
            },
            {
              text: "Arrêt du système en cas de dérive",
              isCorrect: false,
            },
          ],
          explanation:
            "Un système robuste doit détecter, quantifier, et réagir automatiquement à la dérive des données.",
        },
        {
          text: "Avec Ray, comment paralléliser l'entraînement d'un modèle sur plusieurs GPUs ?",
          options: [
            {
              text: "@ray.remote + data parallelism + gradient synchronization + fault tolerance",
              isCorrect: true,
            },
            {
              text: "Simple réplication de code",
              isCorrect: false,
            },
            {
              text: "Threading Python standard",
              isCorrect: false,
            },
            {
              text: "Processus séquentiels",
              isCorrect: false,
            },
          ],
          explanation:
            "Ray fournit une abstraction distribuée avec gestion automatique des pannes et synchronisation des gradients.",
        },
        {
          text: "Dans TensorFlow Extended (TFX), quel est le rôle de Transform ?",
          options: [
            {
              text: "Feature engineering reproductible + preprocessing pipeline + schema validation",
              isCorrect: true,
            },
            {
              text: "Entraînement du modèle",
              isCorrect: false,
            },
            {
              text: "Déploiement en production",
              isCorrect: false,
            },
            {
              text: "Monitoring des performances",
              isCorrect: false,
            },
          ],
          explanation:
            "Transform standardise le preprocessing pour garantir la cohérence entre entraînement et inférence.",
        },
        {
          text: "Pour optimiser Horovod sur un cluster multi-GPU, quels paramètres ajuster ?",
          options: [
            {
              text: "Batch size + learning rate scaling + gradient compression + topology-aware communication",
              isCorrect: true,
            },
            {
              text: "Nombre d'epochs uniquement",
              isCorrect: false,
            },
            {
              text: "Architecture du réseau seulement",
              isCorrect: false,
            },
            {
              text: "Optimizer choice uniquement",
              isCorrect: false,
            },
          ],
          explanation:
            "L'optimisation distribuée nécessite d'ajuster batch size, LR, et communication pour exploiter le parallélisme.",
        },
      ],
    };

    for (const goal of goals) {
      for (let i = 0; i < goal.modules.length; i++) {
        const module = goal.modules[i];
        const moduleTitle = module.title;

        // Utiliser les questions spécialisées si disponibles
        const questions = specializedQuizTemplates[moduleTitle] || [];

        if (questions.length > 0) {
          const quiz = new Quiz({
            moduleId: module._id.toString(),
            title: `Quiz Spécialisé - ${moduleTitle}`,
            description: `Évaluation approfondie avec focus sur les ressources pédagogiques libres de ${moduleTitle}`,
            timeLimit: 3000, // 50 minutes pour questions complexes
            passingScore: 75,
            questions: questions,
          });

          await quiz.save();
          logger.info(`Specialized quiz created for module: ${moduleTitle}`);
        }
      }
    }
  } catch (error) {
    logger.error("Error creating specialized quizzes:", error);
  }
}

async function createAdditionalResourceBasedContent() {
  try {
    // Créer des évaluations basées sur des ressources pédagogiques spécifiques
    const resourceBasedAssessments = [
      {
        title: "Évaluation Stanford CS229 - Machine Learning",
        category: "ml",
        difficulty: "intermediate",
        questions: [
          {
            text: "Selon le cours CS229 d'Andrew Ng, pourquoi utilise-t-on la régularisation L2 dans la régression linéaire ?",
            options: [
              {
                text: "Prévenir l'overfitting en pénalisant les poids importants",
                isCorrect: true,
              },
              { text: "Accélérer la convergence", isCorrect: false },
              {
                text: "Améliorer la précision sur les données d'entraînement",
                isCorrect: false,
              },
              { text: "Réduire le nombre de features", isCorrect: false },
            ],
            explanation:
              "La régularisation L2 ajoute λ∑w² à la fonction de coût pour contrôler la complexité du modèle.",
          },
          {
            text: "Dans CS229, comment est définie la log-likelihood pour la régression logistique ?",
            options: [
              {
                text: "ℓ(θ) = ∑[y⁽ⁱ⁾log h_θ(x⁽ⁱ⁾) + (1-y⁽ⁱ⁾)log(1-h_θ(x⁽ⁱ⁾))]",
                isCorrect: true,
              },
              { text: "ℓ(θ) = ∑(y⁽ⁱ⁾ - h_θ(x⁽ⁱ⁾))²", isCorrect: false },
              { text: "ℓ(θ) = ∑|y⁽ⁱ⁾ - h_θ(x⁽ⁱ⁾)|", isCorrect: false },
              { text: "ℓ(θ) = max(0, 1 - y⁽ⁱ⁾h_θ(x⁽ⁱ⁾))", isCorrect: false },
            ],
            explanation:
              "La log-likelihood pour la régression logistique dérive de la distribution de Bernoulli.",
          },
        ],
        recommendedGoals: [],
      },

      {
        title: "Évaluation Deep Learning Book - Goodfellow",
        category: "dl",
        difficulty: "advanced",
        questions: [
          {
            text: "Selon le livre 'Deep Learning' de Goodfellow, qu'est-ce qui cause le vanishing gradient problem ?",
            options: [
              {
                text: "Multiplication de gradients < 1 à travers les couches profondes",
                isCorrect: true,
              },
              { text: "Learning rate trop élevé", isCorrect: false },
              { text: "Batch size trop petit", isCorrect: false },
              { text: "Overfitting du modèle", isCorrect: false },
            ],
            explanation:
              "Le produit de dérivées < 1 à travers de nombreuses couches fait tendre le gradient vers 0.",
          },
          {
            text: "D'après Goodfellow, pourquoi les fonctions d'activation comme ReLU sont-elles efficaces ?",
            options: [
              {
                text: "Gradient constant (1 ou 0) évite la saturation et accélère l'entraînement",
                isCorrect: true,
              },
              { text: "Elles sont différentiables partout", isCorrect: false },
              {
                text: "Elles produisent des sorties normalisées",
                isCorrect: false,
              },
              { text: "Elles réduisent l'overfitting", isCorrect: false },
            ],
            explanation:
              "ReLU(x) = max(0,x) a un gradient de 1 pour x>0, évitant la saturation des sigmoides.",
          },
        ],
        recommendedGoals: [],
      },

      {
        title: "Évaluation Papers We Love - ML Classics",
        category: "ml",
        difficulty: "advanced",
        questions: [
          {
            text: "Dans le paper 'Support Vector Machines' de Vapnik, que maximise l'algorithme SVM ?",
            options: [
              {
                text: "La marge géométrique entre les classes pour maximiser la généralisation",
                isCorrect: true,
              },
              {
                text: "La précision sur les données d'entraînement",
                isCorrect: false,
              },
              { text: "Le nombre de support vectors", isCorrect: false },
              { text: "La complexité du modèle", isCorrect: false },
            ],
            explanation:
              "SVM trouve l'hyperplan qui maximise la distance minimale aux points les plus proches des deux classes.",
          },
          {
            text: "Selon le paper 'Random Forests' de Breiman, pourquoi les RF évitent-ils l'overfitting ?",
            options: [
              {
                text: "Averaging + bagging + feature randomness réduisent la variance",
                isCorrect: true,
              },
              { text: "Chaque arbre est très simple", isCorrect: false },
              { text: "Utilisation de moins de données", isCorrect: false },
              { text: "Régularisation automatique", isCorrect: false },
            ],
            explanation:
              "La combinaison de bootstrap sampling et feature randomness avec averaging réduit la variance sans augmenter le biais.",
          },
        ],
        recommendedGoals: [],
      },
    ];

    for (const assessmentData of resourceBasedAssessments) {
      const assessment = new Assessment(assessmentData);
      await assessment.save();
      logger.info(`Resource-based assessment created: ${assessmentData.title}`);
    }

    // Ajouter des concepts basés sur des ressources pédagogiques populaires
    const resourceBasedConcepts = [
      {
        name: "Fast.ai Practical Approach",
        description:
          "Méthodologie top-down pour l'apprentissage pratique du deep learning",
        category: "dl",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Kaggle Competition Strategies",
        description:
          "Techniques et stratégies pour exceller dans les compétitions ML",
        category: "ml",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Papers With Code Implementation",
        description:
          "Méthodologie pour implémenter et reproduire des papers de recherche",
        category: "ml",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Jupyter Notebook Best Practices",
        description:
          "Structuration et documentation efficace des notebooks d'analyse",
        category: "programming",
        level: "basic",
        prerequisites: [],
      },
      {
        name: "Open Source Contribution",
        description:
          "Contribution à des projets ML open source et collaboration",
        category: "programming",
        level: "intermediate",
        prerequisites: [],
      },
    ];

    for (const conceptData of resourceBasedConcepts) {
      const concept = new Concept(conceptData);
      await concept.save();
      logger.info(`Resource-based concept created: ${conceptData.name}`);
    }
  } catch (error) {
    logger.error("Error creating additional resource-based content:", error);
  }
}

// Exécuter l'augmentation
augmentDatabase();
