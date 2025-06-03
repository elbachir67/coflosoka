import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";
import { Goal } from "../models/LearningGoal.js";
import { Assessment } from "../models/Assessment.js";
import { User } from "../models/User.js";
import { LearnerProfile } from "../models/LearnerProfile.js";
import { Concept } from "../models/Concept.js";
import { Quiz } from "../models/Quiz.js";
import { Pathway } from "../models/Pathway.js";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

// Users avec les rôles corrects
const users = [
  {
    email: "student1@ucad.edu.sn",
    password: "Student123!",
    role: "user",
    isActive: true,
  },
  {
    email: "student2@ucad.edu.sn",
    password: "Student123!",
    role: "user",
    isActive: true,
  },
  {
    email: "student3@ucad.edu.sn",
    password: "Student123!",
    role: "user",
    isActive: true,
  },
  {
    email: "marie.fall@ucad.edu.sn",
    password: "Marie123!",
    role: "user",
    isActive: true,
  },
  {
    email: "ousmane.sow@ucad.edu.sn",
    password: "Ousmane123!",
    role: "user",
    isActive: true,
  },
  {
    email: "fatou.ba@ucad.edu.sn",
    password: "Fatou123!",
    role: "user",
    isActive: true,
  },
  {
    email: "admin@ucad.edu.sn",
    password: "Admin123!",
    role: "admin",
    isActive: true,
  },
  {
    email: "prof.diallo@ucad.edu.sn",
    password: "Prof123!",
    role: "admin",
    isActive: true,
  },
  {
    email: "prof.ndiaye@ucad.edu.sn",
    password: "Prof123!",
    role: "admin",
    isActive: true,
  },
];

// Concepts sans prérequis (seront ajoutés après création)
const concepts = [
  // Mathématiques
  {
    name: "Algèbre Linéaire pour l'IA",
    description:
      "Vecteurs, matrices, transformations linéaires essentiels pour l'IA",
    category: "math",
    level: "basic",
    prerequisites: [],
  },
  {
    name: "Calcul Différentiel et Intégral",
    description: "Dérivées, intégrales et optimisation pour le ML",
    category: "math",
    level: "intermediate",
    prerequisites: [],
  },
  {
    name: "Probabilités et Statistiques",
    description: "Distributions, tests statistiques et inférence",
    category: "math",
    level: "intermediate",
    prerequisites: [],
  },
  {
    name: "Optimisation Mathématique",
    description: "Gradient descent, convexité et méthodes d'optimisation",
    category: "math",
    level: "advanced",
    prerequisites: [],
  },

  // Programmation
  {
    name: "Python Fondamentaux",
    description:
      "Syntaxe, structures de données et programmation orientée objet",
    category: "programming",
    level: "basic",
    prerequisites: [],
  },
  {
    name: "Python pour la Data Science",
    description: "NumPy, Pandas, Matplotlib pour l'analyse de données",
    category: "programming",
    level: "intermediate",
    prerequisites: [],
  },
  {
    name: "SQL et Bases de Données",
    description: "Requêtes SQL, modélisation et optimisation",
    category: "programming",
    level: "basic",
    prerequisites: [],
  },
  {
    name: "Git et Collaboration",
    description: "Versioning, branches et workflows collaboratifs",
    category: "programming",
    level: "basic",
    prerequisites: [],
  },

  // Machine Learning
  {
    name: "Introduction au Machine Learning",
    description: "Concepts fondamentaux, types d'apprentissage et métriques",
    category: "ml",
    level: "basic",
    prerequisites: [],
  },
  {
    name: "Apprentissage Supervisé",
    description: "Régression, classification et algorithmes classiques",
    category: "ml",
    level: "intermediate",
    prerequisites: [],
  },
  {
    name: "Apprentissage Non Supervisé",
    description: "Clustering, réduction de dimension et détection d'anomalies",
    category: "ml",
    level: "intermediate",
    prerequisites: [],
  },
  {
    name: "Feature Engineering",
    description: "Création, sélection et transformation de features",
    category: "ml",
    level: "intermediate",
    prerequisites: [],
  },

  // Deep Learning
  {
    name: "Réseaux de Neurones",
    description: "Perceptron, backpropagation et architectures de base",
    category: "dl",
    level: "intermediate",
    prerequisites: [],
  },
  {
    name: "CNN - Vision par Ordinateur",
    description: "Convolutions, pooling et architectures CNN modernes",
    category: "dl",
    level: "advanced",
    prerequisites: [],
  },
  {
    name: "RNN et Séquences",
    description: "LSTM, GRU et traitement de séquences",
    category: "dl",
    level: "advanced",
    prerequisites: [],
  },
  {
    name: "Transformers et Attention",
    description: "Architecture transformer, BERT, GPT",
    category: "dl",
    level: "advanced",
    prerequisites: [],
  },
];

// Goals avec les bonnes catégories et niveaux
const goals = [
  {
    title: "Ingénieur Machine Learning",
    description:
      "Parcours complet pour devenir ML Engineer, de la théorie à la pratique",
    category: "ml",
    level: "intermediate",
    estimatedDuration: 12,
    prerequisites: [
      {
        category: "math",
        skills: [
          { name: "Algèbre linéaire", level: "intermediate" },
          { name: "Calcul différentiel", level: "basic" },
          { name: "Probabilités", level: "intermediate" },
        ],
      },
      {
        category: "programming",
        skills: [
          { name: "Python", level: "intermediate" },
          { name: "SQL", level: "basic" },
          { name: "Git", level: "basic" },
        ],
      },
    ],
    modules: [
      {
        title: "Fondamentaux du ML",
        description: "Introduction aux concepts et algorithmes de base",
        duration: 20,
        skills: [
          { name: "Scikit-learn", level: "basic" },
          { name: "Pandas", level: "intermediate" },
        ],
        resources: [
          {
            title: "Machine Learning par Andrew Ng",
            type: "course",
            url: "https://www.coursera.org/learn/machine-learning",
            duration: 120,
          },
          {
            title: "Hands-On Machine Learning",
            type: "book",
            url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/",
            duration: 180,
          },
          {
            title: "Scikit-learn Tutorial",
            type: "tutorial",
            url: "https://scikit-learn.org/stable/tutorial/index.html",
            duration: 60,
          },
          {
            title: "ML Crash Course Google",
            type: "course",
            url: "https://developers.google.com/machine-learning/crash-course",
            duration: 90,
          },
        ],
        validationCriteria: [
          "Comprendre la différence entre apprentissage supervisé et non supervisé",
          "Implémenter une régression linéaire et logistique",
          "Utiliser la validation croisée pour évaluer un modèle",
          "Diagnostiquer overfitting et underfitting",
        ],
      },
      {
        title: "Python et Data Science",
        description: "Maîtrise des outils Python pour le ML",
        duration: 15,
        skills: [
          { name: "NumPy", level: "intermediate" },
          { name: "Pandas", level: "advanced" },
          { name: "Matplotlib", level: "intermediate" },
        ],
        resources: [
          {
            title: "Python Data Science Handbook",
            type: "book",
            url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
            duration: 150,
          },
          {
            title: "Pandas Documentation",
            type: "article",
            url: "https://pandas.pydata.org/docs/",
            duration: 60,
          },
          {
            title: "Data Visualization with Python",
            type: "tutorial",
            url: "https://www.kaggle.com/learn/data-visualization",
            duration: 40,
          },
        ],
        validationCriteria: [
          "Manipuler efficacement des DataFrames Pandas",
          "Créer des visualisations informatives",
          "Nettoyer et préparer des données réelles",
          "Optimiser le code avec NumPy",
        ],
      },
      {
        title: "Algorithmes ML Avancés",
        description: "Ensemble methods, SVM, et techniques avancées",
        duration: 25,
        skills: [
          { name: "Random Forest", level: "intermediate" },
          { name: "XGBoost", level: "intermediate" },
          { name: "Feature Engineering", level: "advanced" },
        ],
        resources: [
          {
            title: "The Elements of Statistical Learning",
            type: "book",
            url: "https://hastie.su.domains/ElemStatLearn/",
            duration: 200,
          },
          {
            title: "XGBoost Documentation",
            type: "article",
            url: "https://xgboost.readthedocs.io/",
            duration: 80,
          },
          {
            title: "Feature Engineering Book",
            type: "book",
            url: "https://www.oreilly.com/library/view/feature-engineering-for/9781491953235/",
            duration: 120,
          },
        ],
        validationCriteria: [
          "Implémenter et optimiser Random Forest et Gradient Boosting",
          "Comprendre les SVM et kernel methods",
          "Maîtriser l'ingénierie des features",
          "Gérer les données déséquilibrées",
        ],
      },
      {
        title: "MLOps et Production",
        description: "Déploiement et maintenance de modèles ML",
        duration: 20,
        skills: [
          { name: "Docker", level: "basic" },
          { name: "API REST", level: "intermediate" },
          { name: "Monitoring", level: "basic" },
        ],
        resources: [
          {
            title: "MLOps: Machine Learning Engineering",
            type: "book",
            url: "https://www.oreilly.com/library/view/machine-learning-engineering/9781492053187/",
            duration: 150,
          },
          {
            title: "Building ML Powered Applications",
            type: "book",
            url: "https://www.oreilly.com/library/view/building-machine-learning/9781492045106/",
            duration: 140,
          },
          {
            title: "FastAPI for ML",
            type: "tutorial",
            url: "https://fastapi.tiangolo.com/tutorial/",
            duration: 60,
          },
        ],
        validationCriteria: [
          "Créer une API pour servir un modèle ML",
          "Containeriser une application ML avec Docker",
          "Mettre en place un pipeline CI/CD",
          "Monitorer les performances en production",
        ],
      },
    ],
    careerOpportunities: [
      {
        title: "Machine Learning Engineer",
        description: "Développement et déploiement de modèles ML en production",
        averageSalary: "45-75k€/an",
        companies: ["Google", "Amazon", "Meta", "Microsoft", "Apple"],
      },
      {
        title: "Data Scientist",
        description: "Analyse de données et création de modèles prédictifs",
        averageSalary: "40-70k€/an",
        companies: ["Netflix", "Uber", "Airbnb", "Spotify", "LinkedIn"],
      },
      {
        title: "ML Researcher",
        description: "Recherche et développement de nouveaux algorithmes",
        averageSalary: "50-85k€/an",
        companies: ["DeepMind", "OpenAI", "FAIR", "Google Research"],
      },
    ],
    certification: {
      available: true,
      name: "Certificat ML Engineer Professional",
      provider: "UCAD AI Center",
      url: "https://ucad.sn/certifications/ml-engineer",
    },
    requiredConcepts: [], // Sera rempli après création des concepts
  },

  {
    title: "Spécialiste Deep Learning",
    description:
      "Expertise en réseaux de neurones profonds et architectures modernes",
    category: "dl",
    level: "advanced",
    estimatedDuration: 16,
    prerequisites: [
      {
        category: "math",
        skills: [
          { name: "Algèbre linéaire", level: "advanced" },
          { name: "Calcul différentiel", level: "intermediate" },
          { name: "Optimisation", level: "intermediate" },
        ],
      },
      {
        category: "programming",
        skills: [
          { name: "Python", level: "advanced" },
          { name: "NumPy", level: "advanced" },
        ],
      },
      {
        category: "theory",
        skills: [{ name: "Machine Learning", level: "intermediate" }],
      },
    ],
    modules: [
      {
        title: "Fondamentaux des Réseaux de Neurones",
        description: "Théorie et pratique des réseaux de neurones",
        duration: 25,
        skills: [
          { name: "PyTorch", level: "intermediate" },
          { name: "TensorFlow", level: "basic" },
        ],
        resources: [
          {
            title: "Deep Learning Specialization",
            type: "course",
            url: "https://www.coursera.org/specializations/deep-learning",
            duration: 200,
          },
          {
            title: "Deep Learning Book",
            type: "book",
            url: "https://www.deeplearningbook.org/",
            duration: 250,
          },
          {
            title: "PyTorch Tutorials",
            type: "tutorial",
            url: "https://pytorch.org/tutorials/",
            duration: 100,
          },
        ],
        validationCriteria: [
          "Implémenter un réseau de neurones from scratch",
          "Comprendre et appliquer la backpropagation",
          "Utiliser PyTorch pour créer des modèles",
          "Debugger et visualiser les réseaux",
        ],
      },
      {
        title: "Vision par Ordinateur avec CNN",
        description: "Applications des CNN pour l'analyse d'images",
        duration: 30,
        skills: [
          { name: "CNN architectures", level: "advanced" },
          { name: "Transfer Learning", level: "intermediate" },
          { name: "Data Augmentation", level: "intermediate" },
        ],
        resources: [
          {
            title: "CS231n: CNN for Visual Recognition",
            type: "course",
            url: "http://cs231n.stanford.edu/",
            duration: 180,
          },
          {
            title: "Papers With Code - Vision",
            type: "article",
            url: "https://paperswithcode.com/area/computer-vision",
            duration: 100,
          },
          {
            title: "Practical Deep Learning for Coders",
            type: "course",
            url: "https://course.fast.ai/",
            duration: 160,
          },
        ],
        validationCriteria: [
          "Implémenter ResNet, VGG, et autres architectures",
          "Utiliser le transfer learning efficacement",
          "Créer un système de détection d'objets",
          "Optimiser les performances sur GPU",
        ],
      },
      {
        title: "NLP avec Transformers",
        description: "Traitement du langage naturel moderne",
        duration: 30,
        skills: [
          { name: "Transformers", level: "advanced" },
          { name: "Hugging Face", level: "intermediate" },
          { name: "BERT/GPT", level: "intermediate" },
        ],
        resources: [
          {
            title: "CS224n: NLP with Deep Learning",
            type: "course",
            url: "http://web.stanford.edu/class/cs224n/",
            duration: 180,
          },
          {
            title: "Hugging Face Course",
            type: "course",
            url: "https://huggingface.co/course",
            duration: 120,
          },
          {
            title: "Attention Is All You Need",
            type: "article",
            url: "https://arxiv.org/abs/1706.03762",
            duration: 30,
          },
        ],
        validationCriteria: [
          "Comprendre l'architecture Transformer",
          "Fine-tuner BERT pour une tâche spécifique",
          "Créer un chatbot ou système de QA",
          "Optimiser l'inférence de grands modèles",
        ],
      },
      {
        title: "Projets Avancés et Recherche",
        description: "Applications cutting-edge du Deep Learning",
        duration: 35,
        skills: [
          { name: "GANs", level: "intermediate" },
          { name: "Reinforcement Learning", level: "basic" },
          { name: "Research", level: "advanced" },
        ],
        resources: [
          {
            title: "GAN Specialization",
            type: "course",
            url: "https://www.coursera.org/specializations/generative-adversarial-networks-gans",
            duration: 150,
          },
          {
            title: "Spinning Up in Deep RL",
            type: "tutorial",
            url: "https://spinningup.openai.com/",
            duration: 180,
          },
          {
            title: "Papers With Code",
            type: "article",
            url: "https://paperswithcode.com/",
            duration: 200,
          },
        ],
        validationCriteria: [
          "Implémenter et entraîner un GAN",
          "Créer un agent RL simple",
          "Reproduire un papier de recherche",
          "Contribuer à un projet open source",
        ],
      },
    ],
    careerOpportunities: [
      {
        title: "Deep Learning Engineer",
        description: "Développement de systèmes DL complexes",
        averageSalary: "55-90k€/an",
        companies: ["DeepMind", "OpenAI", "NVIDIA", "Tesla", "Meta AI"],
      },
      {
        title: "Computer Vision Engineer",
        description: "Spécialiste en traitement d'images et vidéos",
        averageSalary: "50-85k€/an",
        companies: ["Apple", "Google", "Amazon", "Microsoft", "Adobe"],
      },
      {
        title: "NLP Engineer",
        description: "Expert en traitement du langage naturel",
        averageSalary: "55-90k€/an",
        companies: ["Google", "OpenAI", "Anthropic", "Cohere", "Hugging Face"],
      },
    ],
    certification: {
      available: true,
      name: "Deep Learning Expert Certificate",
      provider: "UCAD AI Center",
      url: "https://ucad.sn/certifications/dl-expert",
    },
    requiredConcepts: [],
  },

  {
    title: "Data Scientist",
    description: "Analyse de données, statistiques et communication d'insights",
    category: "data_science",
    level: "intermediate",
    estimatedDuration: 10,
    prerequisites: [
      {
        category: "math",
        skills: [
          { name: "Statistiques", level: "advanced" },
          { name: "Probabilités", level: "intermediate" },
        ],
      },
      {
        category: "programming",
        skills: [
          { name: "Python", level: "intermediate" },
          { name: "SQL", level: "intermediate" },
          { name: "R", level: "basic" },
        ],
      },
    ],
    modules: [
      {
        title: "Analyse Exploratoire de Données",
        description: "EDA, visualisation et storytelling avec les données",
        duration: 20,
        skills: [
          { name: "Pandas", level: "advanced" },
          { name: "Visualization", level: "advanced" },
          { name: "Statistical Tests", level: "intermediate" },
        ],
        resources: [
          {
            title: "Exploratory Data Analysis",
            type: "course",
            url: "https://www.coursera.org/learn/exploratory-data-analysis",
            duration: 80,
          },
          {
            title: "Storytelling with Data",
            type: "book",
            url: "https://www.storytellingwithdata.com/book",
            duration: 100,
          },
          {
            title: "Python Graph Gallery",
            type: "article",
            url: "https://www.python-graph-gallery.com/",
            duration: 60,
          },
        ],
        validationCriteria: [
          "Réaliser une EDA complète sur un dataset complexe",
          "Créer des visualisations impactantes",
          "Identifier et traiter les outliers",
          "Communiquer des insights clairement",
        ],
      },
      {
        title: "Statistiques Inférentielles",
        description: "Tests d'hypothèses et modélisation statistique",
        duration: 25,
        skills: [
          { name: "Hypothesis Testing", level: "advanced" },
          { name: "Regression Analysis", level: "advanced" },
          { name: "Time Series", level: "intermediate" },
        ],
        resources: [
          {
            title: "Statistical Thinking for Data Science",
            type: "book",
            url: "https://www.stat.berkeley.edu/~aldous/157/Books/",
            duration: 150,
          },
          {
            title: "Time Series Analysis",
            type: "course",
            url: "https://www.coursera.org/learn/practical-time-series-analysis",
            duration: 120,
          },
          {
            title: "A/B Testing Guide",
            type: "article",
            url: "https://www.optimizely.com/optimization-glossary/ab-testing/",
            duration: 40,
          },
        ],
        validationCriteria: [
          "Choisir et appliquer le bon test statistique",
          "Interpréter correctement les p-values",
          "Construire des modèles de régression robustes",
          "Analyser des séries temporelles",
        ],
      },
      {
        title: "Machine Learning pour Data Scientists",
        description: "ML pratique orienté business",
        duration: 20,
        skills: [
          { name: "Scikit-learn", level: "intermediate" },
          { name: "Model Interpretation", level: "intermediate" },
          { name: "Business Metrics", level: "advanced" },
        ],
        resources: [
          {
            title: "Applied Predictive Modeling",
            type: "book",
            url: "http://appliedpredictivemodeling.com/",
            duration: 180,
          },
          {
            title: "Interpretable ML",
            type: "book",
            url: "https://christophm.github.io/interpretable-ml-book/",
            duration: 120,
          },
          {
            title: "Business Data Science",
            type: "book",
            url: "https://www.oreilly.com/library/view/business-data-science/9781492072935/",
            duration: 140,
          },
        ],
        validationCriteria: [
          "Traduire un problème business en problème ML",
          "Choisir les bonnes métriques business",
          "Expliquer les modèles aux non-techniques",
          "Évaluer l'impact business des modèles",
        ],
      },
    ],
    careerOpportunities: [
      {
        title: "Data Scientist",
        description: "Analyse et modélisation pour insights business",
        averageSalary: "40-70k€/an",
        companies: ["Airbnb", "Netflix", "Uber", "Spotify", "LinkedIn"],
      },
      {
        title: "Business Intelligence Analyst",
        description: "Transformation des données en décisions business",
        averageSalary: "35-60k€/an",
        companies: ["Amazon", "Microsoft", "Salesforce", "Oracle", "SAP"],
      },
      {
        title: "Quantitative Analyst",
        description: "Analyse quantitative pour finance et trading",
        averageSalary: "50-90k€/an",
        companies: ["JP Morgan", "Goldman Sachs", "Citadel", "Two Sigma"],
      },
    ],
    certification: {
      available: true,
      name: "Data Science Professional Certificate",
      provider: "UCAD AI Center",
      url: "https://ucad.sn/certifications/data-science-pro",
    },
    requiredConcepts: [],
  },

  {
    title: "MLOps Engineer",
    description: "Industrialisation et opérationnalisation des modèles ML",
    category: "mlops",
    level: "advanced",
    estimatedDuration: 14,
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
        category: "tools",
        skills: [
          { name: "Git", level: "advanced" },
          { name: "CI/CD", level: "intermediate" },
          { name: "Linux", level: "intermediate" },
        ],
      },
      {
        category: "theory",
        skills: [{ name: "Machine Learning", level: "intermediate" }],
      },
    ],
    modules: [
      {
        title: "Infrastructure et DevOps pour ML",
        description: "Containerisation, orchestration et cloud",
        duration: 25,
        skills: [
          { name: "Docker", level: "advanced" },
          { name: "Kubernetes", level: "intermediate" },
          { name: "Cloud Platforms", level: "intermediate" },
        ],
        resources: [
          {
            title: "Docker Deep Dive",
            type: "book",
            url: "https://www.oreilly.com/library/view/docker-deep-dive/9781800565135/",
            duration: 120,
          },
          {
            title: "Kubernetes for ML",
            type: "course",
            url: "https://www.coursera.org/learn/machine-learning-engineering-for-production-mlops",
            duration: 150,
          },
          {
            title: "Cloud ML Platforms",
            type: "tutorial",
            url: "https://cloud.google.com/ml-engine/docs",
            duration: 80,
          },
        ],
        validationCriteria: [
          "Containeriser des applications ML",
          "Déployer sur Kubernetes",
          "Utiliser les services cloud ML",
          "Optimiser les coûts infrastructure",
        ],
      },
      {
        title: "Pipelines et Automatisation",
        description: "CI/CD, orchestration et monitoring",
        duration: 30,
        skills: [
          { name: "MLflow", level: "intermediate" },
          { name: "Airflow", level: "intermediate" },
          { name: "Monitoring", level: "advanced" },
        ],
        resources: [
          {
            title: "Building ML Pipelines",
            type: "book",
            url: "https://www.oreilly.com/library/view/building-machine-learning/9781492053187/",
            duration: 160,
          },
          {
            title: "MLflow Guide",
            type: "tutorial",
            url: "https://mlflow.org/docs/latest/tutorials-and-examples/index.html",
            duration: 60,
          },
          {
            title: "Monitoring ML Systems",
            type: "article",
            url: "https://christophergs.com/machine%20learning/2020/03/14/how-to-monitor-machine-learning-models/",
            duration: 40,
          },
        ],
        validationCriteria: [
          "Créer des pipelines ML end-to-end",
          "Implémenter CI/CD pour ML",
          "Monitorer la dérive des modèles",
          "Automatiser le retraining",
        ],
      },
      {
        title: "Gouvernance et Sécurité ML",
        description: "Compliance, sécurité et éthique",
        duration: 20,
        skills: [
          { name: "Model Governance", level: "intermediate" },
          { name: "Security", level: "intermediate" },
          { name: "Compliance", level: "basic" },
        ],
        resources: [
          {
            title: "Secure and Reliable ML",
            type: "book",
            url: "https://www.oreilly.com/library/view/introducing-mlops/9781492083283/",
            duration: 140,
          },
          {
            title: "ML Privacy and Security",
            type: "course",
            url: "https://www.coursera.org/learn/privacy-in-machine-learning",
            duration: 100,
          },
          {
            title: "Responsible AI Practices",
            type: "article",
            url: "https://ai.google/responsibilities/responsible-ai-practices/",
            duration: 60,
          },
        ],
        validationCriteria: [
          "Implémenter la gouvernance des modèles",
          "Sécuriser les pipelines ML",
          "Assurer la conformité RGPD",
          "Détecter et mitiger les biais",
        ],
      },
    ],
    careerOpportunities: [
      {
        title: "MLOps Engineer",
        description: "Opérationnalisation des systèmes ML",
        averageSalary: "50-85k€/an",
        companies: ["Google", "AWS", "Microsoft", "Databricks", "Dataiku"],
      },
      {
        title: "ML Platform Engineer",
        description: "Construction de plateformes ML",
        averageSalary: "55-90k€/an",
        companies: ["Uber", "Netflix", "Airbnb", "Stripe", "Square"],
      },
      {
        title: "ML Infrastructure Engineer",
        description: "Infrastructure scalable pour ML",
        averageSalary: "60-95k€/an",
        companies: ["Meta", "Apple", "Amazon", "NVIDIA", "Tesla"],
      },
    ],
    certification: {
      available: true,
      name: "MLOps Professional Certificate",
      provider: "UCAD AI Center",
      url: "https://ucad.sn/certifications/mlops-pro",
    },
    requiredConcepts: [],
  },

  {
    title: "Computer Vision Expert",
    description:
      "Spécialisation en traitement d'images et vision par ordinateur",
    category: "computer_vision",
    level: "advanced",
    estimatedDuration: 12,
    prerequisites: [
      {
        category: "math",
        skills: [
          { name: "Algèbre linéaire", level: "advanced" },
          { name: "Traitement du signal", level: "intermediate" },
        ],
      },
      {
        category: "programming",
        skills: [
          { name: "Python", level: "advanced" },
          { name: "C++", level: "basic" },
        ],
      },
      {
        category: "theory",
        skills: [{ name: "Deep Learning", level: "intermediate" }],
      },
    ],
    modules: [
      {
        title: "Fondamentaux du Traitement d'Images",
        description: "Théorie et pratique du traitement d'images numériques",
        duration: 20,
        skills: [
          { name: "OpenCV", level: "intermediate" },
          { name: "Image Processing", level: "advanced" },
        ],
        resources: [
          {
            title: "Digital Image Processing",
            type: "book",
            url: "https://www.imageprocessingplace.com/",
            duration: 150,
          },
          {
            title: "OpenCV Python Tutorials",
            type: "tutorial",
            url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",
            duration: 80,
          },
          {
            title: "Computer Vision: Algorithms and Applications",
            type: "book",
            url: "https://szeliski.org/Book/",
            duration: 200,
          },
        ],
        validationCriteria: [
          "Maîtriser les transformations d'images",
          "Implémenter des filtres avancés",
          "Détecter contours et features",
          "Calibrer des caméras",
        ],
      },
      {
        title: "Deep Learning pour la Vision",
        description: "CNNs avancés et architectures modernes",
        duration: 30,
        skills: [
          { name: "Advanced CNNs", level: "advanced" },
          { name: "Object Detection", level: "advanced" },
          { name: "Segmentation", level: "intermediate" },
        ],
        resources: [
          {
            title: "Dive into Deep Learning - CV",
            type: "book",
            url: "https://d2l.ai/chapter_computer-vision/index.html",
            duration: 120,
          },
          {
            title: "YOLO Papers and Implementation",
            type: "article",
            url: "https://arxiv.org/abs/1506.02640",
            duration: 60,
          },
          {
            title: "Detectron2 Tutorial",
            type: "tutorial",
            url: "https://detectron2.readthedocs.io/",
            duration: 100,
          },
        ],
        validationCriteria: [
          "Implémenter YOLO, R-CNN, et autres détecteurs",
          "Créer des modèles de segmentation",
          "Optimiser pour temps réel",
          "Fine-tuner sur datasets custom",
        ],
      },
      {
        title: "Applications Avancées",
        description: "3D vision, tracking, et applications industrielles",
        duration: 25,
        skills: [
          { name: "3D Vision", level: "intermediate" },
          { name: "Video Analysis", level: "intermediate" },
          { name: "Edge Deployment", level: "intermediate" },
        ],
        resources: [
          {
            title: "Multiple View Geometry",
            type: "book",
            url: "https://www.robots.ox.ac.uk/~vgg/hzbook/",
            duration: 180,
          },
          {
            title: "Deep Learning for Videos",
            type: "course",
            url: "https://www.coursera.org/learn/deep-learning-in-computer-vision",
            duration: 140,
          },
          {
            title: "TensorRT Optimization",
            type: "tutorial",
            url: "https://developer.nvidia.com/tensorrt",
            duration: 80,
          },
        ],
        validationCriteria: [
          "Implémenter SLAM ou structure from motion",
          "Créer un système de tracking multi-objets",
          "Déployer sur edge devices",
          "Optimiser avec TensorRT/OpenVINO",
        ],
      },
    ],
    careerOpportunities: [
      {
        title: "Computer Vision Engineer",
        description: "Développement de systèmes de vision",
        averageSalary: "50-85k€/an",
        companies: ["Tesla", "Apple", "Google", "Microsoft", "Amazon"],
      },
      {
        title: "Robotics Vision Engineer",
        description: "Vision pour systèmes robotiques",
        averageSalary: "55-90k€/an",
        companies: ["Boston Dynamics", "Waymo", "Cruise", "Aurora"],
      },
      {
        title: "AR/VR Engineer",
        description: "Réalité augmentée et virtuelle",
        averageSalary: "60-95k€/an",
        companies: ["Meta", "Apple", "Magic Leap", "Niantic"],
      },
    ],
    certification: {
      available: true,
      name: "Computer Vision Specialist Certificate",
      provider: "UCAD AI Center",
      url: "https://ucad.sn/certifications/cv-specialist",
    },
    requiredConcepts: [],
  },

  {
    title: "NLP Engineer",
    description: "Expert en traitement automatique du langage naturel",
    category: "nlp",
    level: "advanced",
    estimatedDuration: 14,
    prerequisites: [
      {
        category: "math",
        skills: [
          { name: "Probabilités", level: "advanced" },
          { name: "Algèbre linéaire", level: "intermediate" },
        ],
      },
      {
        category: "programming",
        skills: [
          { name: "Python", level: "advanced" },
          { name: "Regex", level: "intermediate" },
        ],
      },
      {
        category: "theory",
        skills: [
          { name: "Linguistique computationnelle", level: "basic" },
          { name: "Deep Learning", level: "intermediate" },
        ],
      },
    ],
    modules: [
      {
        title: "Fondamentaux du NLP",
        description: "Bases du traitement du langage et techniques classiques",
        duration: 20,
        skills: [
          { name: "NLTK/spaCy", level: "intermediate" },
          { name: "Text Processing", level: "advanced" },
          { name: "Classical NLP", level: "intermediate" },
        ],
        resources: [
          {
            title: "Speech and Language Processing",
            type: "book",
            url: "https://web.stanford.edu/~jurafsky/slp3/",
            duration: 200,
          },
          {
            title: "Natural Language Processing with Python",
            type: "book",
            url: "https://www.nltk.org/book/",
            duration: 150,
          },
          {
            title: "spaCy Course",
            type: "course",
            url: "https://course.spacy.io/",
            duration: 80,
          },
        ],
        validationCriteria: [
          "Maîtriser tokenization et lemmatization",
          "Implémenter POS tagging et NER",
          "Créer des pipelines de preprocessing",
          "Utiliser des méthodes statistiques classiques",
        ],
      },
      {
        title: "Deep Learning pour NLP",
        description: "RNNs, Transformers et architectures modernes",
        duration: 35,
        skills: [
          { name: "Transformers", level: "advanced" },
          { name: "BERT/GPT", level: "advanced" },
          { name: "Hugging Face", level: "advanced" },
        ],
        resources: [
          {
            title: "Transformers from Scratch",
            type: "tutorial",
            url: "https://peterbloem.nl/blog/transformers",
            duration: 60,
          },
          {
            title: "BERT Paper Deep Dive",
            type: "article",
            url: "https://arxiv.org/abs/1810.04805",
            duration: 40,
          },
          {
            title: "Hugging Face NLP Course",
            type: "course",
            url: "https://huggingface.co/learn/nlp-course",
            duration: 150,
          },
        ],
        validationCriteria: [
          "Comprendre attention et transformers",
          "Fine-tuner BERT/GPT pour tâches custom",
          "Implémenter from scratch un mini-transformer",
          "Optimiser l'inférence de LLMs",
        ],
      },
      {
        title: "Applications NLP Avancées",
        description: "Chatbots, traduction, et génération de texte",
        duration: 30,
        skills: [
          { name: "Dialogue Systems", level: "intermediate" },
          { name: "Machine Translation", level: "intermediate" },
          { name: "Text Generation", level: "advanced" },
        ],
        resources: [
          {
            title: "Neural Machine Translation",
            type: "course",
            url: "https://github.com/tensorflow/nmt",
            duration: 120,
          },
          {
            title: "Building Chatbots with Python",
            type: "book",
            url: "https://www.oreilly.com/library/view/building-chatbots-with/9781484241721/",
            duration: 140,
          },
          {
            title: "LangChain Documentation",
            type: "tutorial",
            url: "https://python.langchain.com/docs/get_started/introduction",
            duration: 100,
          },
        ],
        validationCriteria: [
          "Créer un chatbot fonctionnel",
          "Implémenter un système de QA",
          "Construire un système de traduction",
          "Développer avec LangChain",
        ],
      },
    ],
    careerOpportunities: [
      {
        title: "NLP Engineer",
        description: "Développement de systèmes NLP",
        averageSalary: "55-90k€/an",
        companies: ["Google", "OpenAI", "Anthropic", "Cohere", "DeepL"],
      },
      {
        title: "Conversational AI Engineer",
        description: "Chatbots et assistants virtuels",
        averageSalary: "50-85k€/an",
        companies: ["Amazon", "Apple", "Microsoft", "Rasa", "Dialogflow"],
      },
      {
        title: "Language Model Engineer",
        description: "Développement et fine-tuning de LLMs",
        averageSalary: "60-100k€/an",
        companies: ["OpenAI", "Anthropic", "Google", "Meta", "Mistral"],
      },
    ],
    certification: {
      available: true,
      name: "NLP Specialist Certificate",
      provider: "UCAD AI Center",
      url: "https://ucad.sn/certifications/nlp-specialist",
    },
    requiredConcepts: [],
  },
];

// Quizzes pour chaque module
const quizTemplates = {
  ml_fundamentals: {
    title: "Quiz Fondamentaux ML",
    description: "Testez vos connaissances sur les bases du ML",
    timeLimit: 1800,
    passingScore: 70,
    questions: [
      {
        text: "Quelle est la différence principale entre classification et régression ?",
        options: [
          {
            text: "La classification prédit des catégories, la régression des valeurs continues",
            isCorrect: true,
          },
          {
            text: "La classification est plus rapide que la régression",
            isCorrect: false,
          },
          { text: "La régression nécessite plus de données", isCorrect: false },
          { text: "Il n'y a pas de différence", isCorrect: false },
        ],
        explanation:
          "La classification prédit des classes discrètes tandis que la régression prédit des valeurs numériques continues.",
      },
      {
        text: "Qu'est-ce que le surapprentissage (overfitting) ?",
        options: [
          {
            text: "Le modèle mémorise les données d'entraînement au lieu de généraliser",
            isCorrect: true,
          },
          { text: "Le modèle apprend trop vite", isCorrect: false },
          { text: "Le modèle a trop de données", isCorrect: false },
          { text: "Le modèle est trop simple", isCorrect: false },
        ],
        explanation:
          "L'overfitting se produit quand le modèle s'adapte trop aux données d'entraînement et performe mal sur de nouvelles données.",
      },
      {
        text: "Quelle métrique utiliser pour un dataset déséquilibré ?",
        options: [
          { text: "F1-Score ou AUC-ROC", isCorrect: true },
          { text: "Accuracy uniquement", isCorrect: false },
          { text: "MSE", isCorrect: false },
          { text: "R-squared", isCorrect: false },
        ],
        explanation:
          "F1-Score et AUC-ROC sont plus appropriés car ils prennent en compte le déséquilibre des classes.",
      },
      {
        text: "Qu'est-ce que la validation croisée ?",
        options: [
          {
            text: "Une technique pour évaluer la performance en divisant les données en k parties",
            isCorrect: true,
          },
          { text: "Valider le modèle deux fois", isCorrect: false },
          { text: "Croiser deux modèles différents", isCorrect: false },
          { text: "Valider sur les données d'entraînement", isCorrect: false },
        ],
        explanation:
          "La validation croisée divise les données en k parties pour une évaluation plus robuste du modèle.",
      },
      {
        text: "Quel est le rôle de la régularisation ?",
        options: [
          {
            text: "Prévenir le surapprentissage en pénalisant la complexité",
            isCorrect: true,
          },
          { text: "Accélérer l'entraînement", isCorrect: false },
          { text: "Augmenter la précision", isCorrect: false },
          { text: "Réduire le nombre de features", isCorrect: false },
        ],
        explanation:
          "La régularisation ajoute une pénalité pour limiter la complexité du modèle et éviter l'overfitting.",
      },
    ],
  },

  python_data_science: {
    title: "Quiz Python pour Data Science",
    description: "Évaluez vos compétences Python pour l'analyse de données",
    timeLimit: 1500,
    passingScore: 70,
    questions: [
      {
        text: "Comment créer un DataFrame Pandas à partir d'un dictionnaire ?",
        options: [
          { text: "pd.DataFrame(dict)", isCorrect: true },
          { text: "pd.create_dataframe(dict)", isCorrect: false },
          { text: "pd.from_dict(dict)", isCorrect: false },
          { text: "DataFrame.new(dict)", isCorrect: false },
        ],
        explanation:
          "pd.DataFrame() peut directement créer un DataFrame à partir d'un dictionnaire.",
      },
      {
        text: "Quelle méthode Pandas permet de grouper et agréger des données ?",
        options: [
          { text: "groupby()", isCorrect: true },
          { text: "aggregate()", isCorrect: false },
          { text: "group()", isCorrect: false },
          { text: "cluster()", isCorrect: false },
        ],
        explanation:
          "groupby() permet de grouper les données selon une ou plusieurs colonnes pour ensuite appliquer des agrégations.",
      },
      {
        text: "Comment gérer les valeurs manquantes dans un DataFrame ?",
        options: [
          { text: "fillna(), dropna(), ou interpolate()", isCorrect: true },
          { text: "remove_null()", isCorrect: false },
          { text: "clean_data()", isCorrect: false },
          { text: "fix_missing()", isCorrect: false },
        ],
        explanation:
          "Pandas offre plusieurs méthodes pour gérer les valeurs manquantes selon le contexte.",
      },
      {
        text: "Quelle est la différence entre loc et iloc ?",
        options: [
          {
            text: "loc utilise les labels, iloc utilise les positions entières",
            isCorrect: true,
          },
          { text: "loc est plus rapide qu'iloc", isCorrect: false },
          { text: "iloc accepte plus de types de données", isCorrect: false },
          { text: "Il n'y a pas de différence", isCorrect: false },
        ],
        explanation:
          "loc accède aux données par labels/noms tandis qu'iloc utilise les indices de position.",
      },
    ],
  },

  deep_learning_basics: {
    title: "Quiz Réseaux de Neurones",
    description: "Testez vos connaissances en deep learning",
    timeLimit: 2100,
    passingScore: 75,
    questions: [
      {
        text: "Quelle fonction d'activation évite le problème du gradient vanishing ?",
        options: [
          { text: "ReLU", isCorrect: true },
          { text: "Sigmoid", isCorrect: false },
          { text: "Tanh", isCorrect: false },
          { text: "Linear", isCorrect: false },
        ],
        explanation:
          "ReLU maintient le gradient pour les valeurs positives, évitant ainsi le vanishing gradient.",
      },
      {
        text: "Qu'est-ce que le dropout ?",
        options: [
          {
            text: "Une technique de régularisation qui désactive aléatoirement des neurones",
            isCorrect: true,
          },
          { text: "Supprimer des couches du réseau", isCorrect: false },
          { text: "Réduire le learning rate", isCorrect: false },
          { text: "Arrêter l'entraînement tôt", isCorrect: false },
        ],
        explanation:
          "Le dropout désactive aléatoirement des neurones pendant l'entraînement pour éviter l'overfitting.",
      },
      {
        text: "Quel est le rôle du batch normalization ?",
        options: [
          {
            text: "Normaliser les activations pour stabiliser l'entraînement",
            isCorrect: true,
          },
          { text: "Normaliser les données d'entrée", isCorrect: false },
          { text: "Réduire la taille des batchs", isCorrect: false },
          { text: "Augmenter la vitesse de calcul", isCorrect: false },
        ],
        explanation:
          "Batch normalization normalise les activations de chaque couche pour un entraînement plus stable et rapide.",
      },
      {
        text: "Quelle architecture est spécialisée pour les séquences ?",
        options: [
          { text: "RNN/LSTM", isCorrect: true },
          { text: "CNN", isCorrect: false },
          { text: "Autoencoder", isCorrect: false },
          { text: "GAN", isCorrect: false },
        ],
        explanation:
          "Les RNN et LSTM sont conçus pour traiter des données séquentielles avec mémoire temporelle.",
      },
      {
        text: "Comment fonctionne le mécanisme d'attention ?",
        options: [
          {
            text: "Il pondère l'importance des différentes parties de l'entrée",
            isCorrect: true,
          },
          { text: "Il augmente le learning rate", isCorrect: false },
          { text: "Il réduit le nombre de paramètres", isCorrect: false },
          { text: "Il accélère la convergence", isCorrect: false },
        ],
        explanation:
          "L'attention calcule des poids pour déterminer quelles parties de l'entrée sont importantes pour la tâche.",
      },
    ],
  },

  computer_vision_quiz: {
    title: "Quiz Vision par Ordinateur",
    description: "Évaluez vos connaissances en computer vision",
    timeLimit: 1800,
    passingScore: 70,
    questions: [
      {
        text: "Qu'est-ce qu'une convolution dans un CNN ?",
        options: [
          {
            text: "Une opération qui applique un filtre pour extraire des features",
            isCorrect: true,
          },
          { text: "Une fonction d'activation", isCorrect: false },
          { text: "Une méthode de pooling", isCorrect: false },
          { text: "Une technique d'augmentation", isCorrect: false },
        ],
        explanation:
          "La convolution applique des filtres apprenables pour détecter des motifs dans l'image.",
      },
      {
        text: "Quel est le rôle du pooling dans un CNN ?",
        options: [
          {
            text: "Réduire la dimension spatiale et extraire les features dominantes",
            isCorrect: true,
          },
          { text: "Augmenter la résolution", isCorrect: false },
          { text: "Ajouter du bruit", isCorrect: false },
          { text: "Normaliser les pixels", isCorrect: false },
        ],
        explanation:
          "Le pooling réduit la taille des feature maps tout en conservant l'information importante.",
      },
      {
        text: "Qu'est-ce que le transfer learning en CV ?",
        options: [
          {
            text: "Utiliser un modèle pré-entraîné et l'adapter à une nouvelle tâche",
            isCorrect: true,
          },
          { text: "Transférer des images entre datasets", isCorrect: false },
          { text: "Copier l'architecture d'un modèle", isCorrect: false },
          { text: "Partager des poids entre couches", isCorrect: false },
        ],
        explanation:
          "Le transfer learning réutilise les features apprises sur un grand dataset pour une nouvelle tâche.",
      },
      {
        text: "Quelle métrique est utilisée pour la détection d'objets ?",
        options: [
          { text: "mAP (mean Average Precision)", isCorrect: true },
          { text: "Accuracy", isCorrect: false },
          { text: "BLEU score", isCorrect: false },
          { text: "Perplexity", isCorrect: false },
        ],
        explanation:
          "mAP évalue la précision de détection en considérant la localisation et la classification.",
      },
    ],
  },

  nlp_fundamentals: {
    title: "Quiz NLP Fondamentaux",
    description: "Testez vos connaissances en traitement du langage",
    timeLimit: 1800,
    passingScore: 70,
    questions: [
      {
        text: "Qu'est-ce que la tokenisation ?",
        options: [
          {
            text: "Diviser le texte en unités plus petites (mots, sous-mots)",
            isCorrect: true,
          },
          { text: "Traduire le texte", isCorrect: false },
          { text: "Compresser le texte", isCorrect: false },
          { text: "Analyser la grammaire", isCorrect: false },
        ],
        explanation:
          "La tokenisation découpe le texte en tokens qui peuvent être des mots, sous-mots ou caractères.",
      },
      {
        text: "Qu'est-ce qu'un embedding de mots ?",
        options: [
          {
            text: "Une représentation vectorielle dense des mots",
            isCorrect: true,
          },
          { text: "Un dictionnaire de synonymes", isCorrect: false },
          { text: "Une liste de mots-clés", isCorrect: false },
          { text: "Un compteur de fréquence", isCorrect: false },
        ],
        explanation:
          "Les embeddings représentent les mots comme des vecteurs denses capturant leur sémantique.",
      },
      {
        text: "Quel est l'avantage principal des Transformers sur les RNN ?",
        options: [
          {
            text: "Traitement parallèle et capture de dépendances longues",
            isCorrect: true,
          },
          { text: "Moins de paramètres", isCorrect: false },
          { text: "Plus rapide à entraîner", isCorrect: false },
          { text: "Meilleur pour les courtes séquences", isCorrect: false },
        ],
        explanation:
          "Les Transformers peuvent traiter toute la séquence en parallèle grâce à l'attention.",
      },
      {
        text: "Qu'est-ce que le fine-tuning d'un modèle de langage ?",
        options: [
          {
            text: "Adapter un modèle pré-entraîné à une tâche spécifique",
            isCorrect: true,
          },
          { text: "Réduire la taille du modèle", isCorrect: false },
          { text: "Augmenter le vocabulaire", isCorrect: false },
          { text: "Changer l'architecture", isCorrect: false },
        ],
        explanation:
          "Le fine-tuning adapte un modèle pré-entraîné en continuant l'entraînement sur des données spécifiques.",
      },
    ],
  },

  mlops_infrastructure: {
    title: "Quiz MLOps et Infrastructure",
    description: "Évaluez vos connaissances en MLOps",
    timeLimit: 1800,
    passingScore: 70,
    questions: [
      {
        text: "Qu'est-ce que le model drift ?",
        options: [
          {
            text: "Dégradation des performances du modèle due aux changements dans les données",
            isCorrect: true,
          },
          { text: "Un bug dans le code du modèle", isCorrect: false },
          { text: "L'augmentation de la latence", isCorrect: false },
          { text: "La corruption des poids", isCorrect: false },
        ],
        explanation:
          "Le model drift se produit quand la distribution des données change par rapport à l'entraînement.",
      },
      {
        text: "Quel est l'avantage principal de Docker pour le ML ?",
        options: [
          {
            text: "Reproductibilité et isolation de l'environnement",
            isCorrect: true,
          },
          { text: "Entraînement plus rapide", isCorrect: false },
          { text: "Meilleure précision", isCorrect: false },
          { text: "Réduction de la taille du modèle", isCorrect: false },
        ],
        explanation:
          "Docker garantit que l'environnement d'exécution est identique en développement et production.",
      },
      {
        text: "Qu'est-ce que MLflow ?",
        options: [
          {
            text: "Une plateforme pour gérer le cycle de vie ML",
            isCorrect: true,
          },
          { text: "Un framework de deep learning", isCorrect: false },
          { text: "Un outil de visualisation", isCorrect: false },
          { text: "Une base de données", isCorrect: false },
        ],
        explanation:
          "MLflow aide à tracker les expériences, packager le code et déployer les modèles.",
      },
      {
        text: "Pourquoi monitorer les modèles en production ?",
        options: [
          {
            text: "Détecter la dégradation des performances et les anomalies",
            isCorrect: true,
          },
          { text: "Augmenter la vitesse d'inférence", isCorrect: false },
          { text: "Réduire les coûts", isCorrect: false },
          { text: "Améliorer l'accuracy", isCorrect: false },
        ],
        explanation:
          "Le monitoring permet de détecter rapidement les problèmes et maintenir la qualité du service.",
      },
    ],
  },

  data_analysis_viz: {
    title: "Quiz Analyse et Visualisation",
    description: "Testez vos compétences en analyse de données",
    timeLimit: 1500,
    passingScore: 70,
    questions: [
      {
        text: "Quel type de graphique pour montrer une distribution ?",
        options: [
          { text: "Histogramme ou boxplot", isCorrect: true },
          { text: "Pie chart", isCorrect: false },
          { text: "Line plot", isCorrect: false },
          { text: "Scatter plot", isCorrect: false },
        ],
        explanation:
          "Histogrammes et boxplots sont idéaux pour visualiser la distribution des données.",
      },
      {
        text: "Qu'est-ce que la corrélation de Pearson mesure ?",
        options: [
          {
            text: "La relation linéaire entre deux variables",
            isCorrect: true,
          },
          { text: "La causalité entre variables", isCorrect: false },
          { text: "La différence de moyennes", isCorrect: false },
          { text: "La variance totale", isCorrect: false },
        ],
        explanation:
          "Le coefficient de Pearson mesure la force et direction de la relation linéaire (-1 à 1).",
      },
      {
        text: "Comment détecter les outliers dans un dataset ?",
        options: [
          { text: "IQR, Z-score, ou méthodes de clustering", isCorrect: true },
          { text: "Moyenne et médiane", isCorrect: false },
          { text: "Régression linéaire", isCorrect: false },
          { text: "Test t de Student", isCorrect: false },
        ],
        explanation:
          "IQR et Z-score sont des méthodes statistiques classiques pour identifier les valeurs aberrantes.",
      },
      {
        text: "Quel principe suivre pour une bonne visualisation ?",
        options: [
          {
            text: "Clarté, simplicité et pertinence du message",
            isCorrect: true,
          },
          { text: "Maximum de couleurs et effets", isCorrect: false },
          { text: "Toujours utiliser 3D", isCorrect: false },
          { text: "Inclure toutes les données", isCorrect: false },
        ],
        explanation:
          "Une bonne visualisation communique clairement un message sans surcharge visuelle.",
      },
    ],
  },
};

// Assessments pour évaluation initiale
const assessments = [
  {
    title: "Évaluation Initiale - Mathématiques",
    category: "math",
    difficulty: "basic",
    questions: [
      {
        text: "Qu'est-ce qu'un vecteur propre d'une matrice ?",
        options: [
          {
            text: "Un vecteur qui ne change que d'échelle lors de la multiplication",
            isCorrect: true,
          },
          { text: "Un vecteur de norme 1", isCorrect: false },
          { text: "Un vecteur orthogonal", isCorrect: false },
          { text: "La première colonne de la matrice", isCorrect: false },
        ],
        explanation:
          "Av = λv, où v est le vecteur propre et λ la valeur propre.",
      },
      {
        text: "Quelle est la dérivée de f(x) = x² ?",
        options: [
          { text: "2x", isCorrect: true },
          { text: "x", isCorrect: false },
          { text: "x²/2", isCorrect: false },
          { text: "2", isCorrect: false },
        ],
        explanation: "La dérivée de x^n est n*x^(n-1), donc pour x², c'est 2x.",
      },
    ],
    recommendedGoals: [], // Sera rempli après création
  },

  {
    title: "Évaluation Initiale - Programmation",
    category: "programming",
    difficulty: "basic",
    questions: [
      {
        text: "Quelle est la complexité temporelle d'une recherche dans une liste triée ?",
        options: [
          { text: "O(log n) avec recherche binaire", isCorrect: true },
          { text: "O(n)", isCorrect: false },
          { text: "O(n²)", isCorrect: false },
          { text: "O(1)", isCorrect: false },
        ],
        explanation:
          "La recherche binaire divise l'espace de recherche par 2 à chaque étape.",
      },
      {
        text: "Qu'est-ce qu'une list comprehension en Python ?",
        options: [
          {
            text: "Une syntaxe concise pour créer des listes",
            isCorrect: true,
          },
          { text: "Une méthode pour compresser des listes", isCorrect: false },
          { text: "Un type de boucle", isCorrect: false },
          { text: "Une fonction built-in", isCorrect: false },
        ],
        explanation:
          "[x**2 for x in range(10)] est un exemple de list comprehension.",
      },
    ],
    recommendedGoals: [],
  },

  {
    title: "Évaluation ML - Niveau Intermédiaire",
    category: "ml",
    difficulty: "intermediate",
    questions: [
      {
        text: "Quelle technique permet de réduire la dimension tout en préservant la variance ?",
        options: [
          { text: "PCA (Principal Component Analysis)", isCorrect: true },
          { text: "K-means clustering", isCorrect: false },
          { text: "Random Forest", isCorrect: false },
          { text: "Gradient Boosting", isCorrect: false },
        ],
        explanation:
          "PCA projette les données sur les axes de variance maximale.",
      },
      {
        text: "Comment gérer un problème de classification multi-classes déséquilibré ?",
        options: [
          {
            text: "SMOTE, class weights, ou ensemble methods",
            isCorrect: true,
          },
          { text: "Ignorer le déséquilibre", isCorrect: false },
          { text: "Utiliser seulement accuracy", isCorrect: false },
          { text: "Supprimer les classes minoritaires", isCorrect: false },
        ],
        explanation:
          "Ces techniques compensent le déséquilibre sans perdre d'information.",
      },
      {
        text: "Qu'est-ce que le gradient boosting ?",
        options: [
          {
            text: "Un ensemble method qui entraîne des modèles séquentiellement",
            isCorrect: true,
          },
          {
            text: "Une technique d'optimisation du gradient",
            isCorrect: false,
          },
          { text: "Un type de réseau de neurones", isCorrect: false },
          { text: "Une méthode de feature selection", isCorrect: false },
        ],
        explanation:
          "Chaque modèle corrige les erreurs du précédent dans le gradient boosting.",
      },
    ],
    recommendedGoals: [],
  },

  {
    title: "Évaluation Deep Learning",
    category: "dl",
    difficulty: "advanced",
    questions: [
      {
        text: "Qu'est-ce que le gradient clipping ?",
        options: [
          {
            text: "Limiter la norme des gradients pour éviter l'explosion",
            isCorrect: true,
          },
          { text: "Supprimer les gradients négatifs", isCorrect: false },
          { text: "Accélérer la backpropagation", isCorrect: false },
          { text: "Réduire le nombre de paramètres", isCorrect: false },
        ],
        explanation:
          "Le gradient clipping évite l'instabilité numérique lors de l'entraînement.",
      },
      {
        text: "Comment fonctionne l'attention multi-têtes ?",
        options: [
          {
            text: "Plusieurs mécanismes d'attention en parallèle avec différentes projections",
            isCorrect: true,
          },
          { text: "Attention sur plusieurs couches", isCorrect: false },
          { text: "Plusieurs modèles indépendants", isCorrect: false },
          { text: "Attention bidirectionnelle", isCorrect: false },
        ],
        explanation:
          "Multi-head attention permet de capturer différents types de relations.",
      },
      {
        text: "Quel est l'avantage des connexions résiduelles ?",
        options: [
          {
            text: "Faciliter le flux du gradient dans les réseaux profonds",
            isCorrect: true,
          },
          { text: "Réduire le nombre de paramètres", isCorrect: false },
          { text: "Accélérer l'inférence", isCorrect: false },
          { text: "Améliorer la précision", isCorrect: false },
        ],
        explanation:
          "Les skip connections permettent au gradient de bypasser des couches.",
      },
    ],
    recommendedGoals: [],
  },

  {
    title: "Évaluation Computer Vision",
    category: "computer_vision",
    difficulty: "intermediate",
    questions: [
      {
        text: "Qu'est-ce que l'IoU (Intersection over Union) ?",
        options: [
          {
            text: "Métrique pour évaluer la qualité de la détection d'objets",
            isCorrect: true,
          },
          { text: "Une fonction de loss", isCorrect: false },
          { text: "Un type de pooling", isCorrect: false },
          { text: "Une architecture CNN", isCorrect: false },
        ],
        explanation:
          "IoU mesure le chevauchement entre la prédiction et la vérité terrain.",
      },
      {
        text: "Quelle est la différence entre détection et segmentation ?",
        options: [
          {
            text: "La détection donne des bounding boxes, la segmentation des masques pixel par pixel",
            isCorrect: true,
          },
          { text: "La segmentation est plus rapide", isCorrect: false },
          { text: "La détection est plus précise", isCorrect: false },
          { text: "Il n'y a pas de différence", isCorrect: false },
        ],
        explanation:
          "La segmentation fournit une classification au niveau du pixel.",
      },
    ],
    recommendedGoals: [],
  },

  {
    title: "Évaluation NLP",
    category: "nlp",
    difficulty: "intermediate",
    questions: [
      {
        text: "Qu'est-ce que le BLEU score ?",
        options: [
          {
            text: "Une métrique pour évaluer la qualité de la traduction",
            isCorrect: true,
          },
          { text: "Un algorithme de tokenisation", isCorrect: false },
          { text: "Une architecture de modèle", isCorrect: false },
          { text: "Une technique d'embedding", isCorrect: false },
        ],
        explanation:
          "BLEU compare les n-grammes entre la traduction et les références.",
      },
      {
        text: "Qu'est-ce que le masquage dans BERT ?",
        options: [
          {
            text: "Cacher aléatoirement des tokens pour l'entraînement",
            isCorrect: true,
          },
          { text: "Filtrer les mots non pertinents", isCorrect: false },
          { text: "Réduire la taille du vocabulaire", isCorrect: false },
          { text: "Anonymiser les données", isCorrect: false },
        ],
        explanation:
          "Le masked language modeling est la tâche de pré-entraînement de BERT.",
      },
    ],
    recommendedGoals: [],
  },

  {
    title: "Évaluation MLOps",
    category: "mlops",
    difficulty: "intermediate",
    questions: [
      {
        text: "Qu'est-ce que le A/B testing pour les modèles ML ?",
        options: [
          {
            text: "Comparer deux versions de modèles en production",
            isCorrect: true,
          },
          { text: "Tester deux datasets différents", isCorrect: false },
          { text: "Entraîner deux modèles en parallèle", isCorrect: false },
          { text: "Valider avec deux métriques", isCorrect: false },
        ],
        explanation:
          "L'A/B testing permet de comparer les performances réelles de deux modèles.",
      },
      {
        text: "Pourquoi versionner les données en ML ?",
        options: [
          {
            text: "Assurer la reproductibilité et tracer les changements",
            isCorrect: true,
          },
          { text: "Réduire l'espace de stockage", isCorrect: false },
          { text: "Accélérer l'entraînement", isCorrect: false },
          { text: "Améliorer la précision", isCorrect: false },
        ],
        explanation:
          "Le versioning des données est crucial pour reproduire les résultats.",
      },
    ],
    recommendedGoals: [],
  },
];

async function populateDatabase() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Nettoyer la base de données
    await Promise.all([
      User.deleteMany({}),
      Goal.deleteMany({}),
      Assessment.deleteMany({}),
      Concept.deleteMany({}),
      Quiz.deleteMany({}),
      LearnerProfile.deleteMany({}),
      Pathway.deleteMany({}),
    ]);
    logger.info("Database cleaned");

    // Créer les utilisateurs
    const createdUsers = await User.create(users);
    logger.info(`Created ${createdUsers.length} users`);

    // Créer les concepts
    const createdConcepts = await Concept.create(concepts);
    logger.info(`Created ${createdConcepts.length} concepts`);

    // Créer un mapping des concepts
    const conceptMap = {};
    createdConcepts.forEach(concept => {
      conceptMap[concept.name] = concept._id;
    });

    // Définir les relations de prérequis
    const prerequisites = {
      "Calcul Différentiel et Intégral": ["Algèbre Linéaire pour l'IA"],
      "Probabilités et Statistiques": ["Calcul Différentiel et Intégral"],
      "Optimisation Mathématique": [
        "Calcul Différentiel et Intégral",
        "Algèbre Linéaire pour l'IA",
      ],
      "Python pour la Data Science": ["Python Fondamentaux"],
      "Introduction au Machine Learning": [
        "Python pour la Data Science",
        "Probabilités et Statistiques",
      ],
      "Apprentissage Supervisé": ["Introduction au Machine Learning"],
      "Apprentissage Non Supervisé": ["Introduction au Machine Learning"],
      "Feature Engineering": [
        "Apprentissage Supervisé",
        "Apprentissage Non Supervisé",
      ],
      "Réseaux de Neurones": [
        "Apprentissage Supervisé",
        "Optimisation Mathématique",
      ],
      "CNN - Vision par Ordinateur": ["Réseaux de Neurones"],
      "RNN et Séquences": ["Réseaux de Neurones"],
      "Transformers et Attention": ["RNN et Séquences"],
    };

    // Mettre à jour les prérequis
    for (const [conceptName, prereqNames] of Object.entries(prerequisites)) {
      const prereqIds = prereqNames
        .map(name => conceptMap[name])
        .filter(id => id);
      if (conceptMap[conceptName]) {
        await Concept.findByIdAndUpdate(conceptMap[conceptName], {
          prerequisites: prereqIds,
        });
      }
    }
    logger.info("Updated concept prerequisites");

    // Ajouter les concepts requis aux goals
    const goalConceptMapping = {
      "Ingénieur Machine Learning": [
        "Python Fondamentaux",
        "Python pour la Data Science",
        "Algèbre Linéaire pour l'IA",
        "Probabilités et Statistiques",
        "Introduction au Machine Learning",
        "Apprentissage Supervisé",
        "Feature Engineering",
      ],
      "Spécialiste Deep Learning": [
        "Algèbre Linéaire pour l'IA",
        "Calcul Différentiel et Intégral",
        "Optimisation Mathématique",
        "Python pour la Data Science",
        "Introduction au Machine Learning",
        "Réseaux de Neurones",
        "CNN - Vision par Ordinateur",
        "RNN et Séquences",
        "Transformers et Attention",
      ],
      "Data Scientist": [
        "Probabilités et Statistiques",
        "Python Fondamentaux",
        "Python pour la Data Science",
        "SQL et Bases de Données",
        "Introduction au Machine Learning",
      ],
      "MLOps Engineer": [
        "Python Fondamentaux",
        "Git et Collaboration",
        "Introduction au Machine Learning",
        "SQL et Bases de Données",
      ],
      "Computer Vision Expert": [
        "Algèbre Linéaire pour l'IA",
        "Python pour la Data Science",
        "Réseaux de Neurones",
        "CNN - Vision par Ordinateur",
      ],
      "NLP Engineer": [
        "Probabilités et Statistiques",
        "Python pour la Data Science",
        "Réseaux de Neurones",
        "RNN et Séquences",
        "Transformers et Attention",
      ],
    };

    // Ajouter les IDs de concepts aux goals
    goals.forEach(goal => {
      const conceptNames = goalConceptMapping[goal.title] || [];
      goal.requiredConcepts = conceptNames
        .map(name => conceptMap[name])
        .filter(id => id);
    });

    // Créer les goals
    const createdGoals = await Goal.create(goals);
    logger.info(`Created ${createdGoals.length} goals`);

    // Créer les quiz pour chaque module
    const quizzesWithModuleIds = [];
    const quizTemplateKeys = Object.keys(quizTemplates);
    let templateIndex = 0;

    for (const goal of createdGoals) {
      for (const module of goal.modules) {
        // Sélectionner un template de quiz approprié
        const template =
          quizTemplates[
            quizTemplateKeys[templateIndex % quizTemplateKeys.length]
          ];
        templateIndex++;

        const quiz = {
          ...template,
          moduleId: module._id.toString(),
          title: `Quiz - ${module.title}`,
          description: `Évaluation des connaissances pour ${module.title}`,
        };
        quizzesWithModuleIds.push(quiz);
      }
    }

    const createdQuizzes = await Quiz.create(quizzesWithModuleIds);
    logger.info(`Created ${createdQuizzes.length} quizzes`);

    // Ajouter les goals recommandés aux assessments
    const assessmentGoalMapping = {
      "Évaluation Initiale - Mathématiques": [
        "Data Scientist",
        "Spécialiste Deep Learning",
      ],
      "Évaluation Initiale - Programmation": [
        "Ingénieur Machine Learning",
        "MLOps Engineer",
      ],
      "Évaluation ML - Niveau Intermédiaire": [
        "Ingénieur Machine Learning",
        "Spécialiste Deep Learning",
      ],
      "Évaluation Deep Learning": [
        "Spécialiste Deep Learning",
        "Computer Vision Expert",
        "NLP Engineer",
      ],
      "Évaluation Computer Vision": [
        "Computer Vision Expert",
        "Spécialiste Deep Learning",
      ],
      "Évaluation NLP": ["NLP Engineer", "Spécialiste Deep Learning"],
      "Évaluation MLOps": ["MLOps Engineer", "Ingénieur Machine Learning"],
    };

    // Créer un mapping des goals
    const goalMap = {};
    createdGoals.forEach(goal => {
      goalMap[goal.title] = goal._id;
    });

    // Ajouter les IDs de goals aux assessments
    assessments.forEach(assessment => {
      const goalTitles = assessmentGoalMapping[assessment.title] || [];
      assessment.recommendedGoals = goalTitles
        .map(title => goalMap[title])
        .filter(id => id);
    });

    // Créer les assessments
    const createdAssessments = await Assessment.create(assessments);
    logger.info(`Created ${createdAssessments.length} assessments`);

    // Créer des profils d'apprenants variés
    const learningStyles = ["visual", "auditory", "reading", "kinesthetic"];
    const mathLevels = ["beginner", "intermediate", "advanced", "expert"];
    const programmingLevels = [
      "beginner",
      "intermediate",
      "advanced",
      "expert",
    ];
    const preferredDomains = ["ml", "dl", "computer_vision", "nlp", "mlops"];

    const learnerProfiles = [];
    const userList = createdUsers.filter(user => user.role === "user");

    for (let i = 0; i < userList.length; i++) {
      const user = userList[i];
      const profile = {
        userId: user._id,
        learningStyle: learningStyles[i % learningStyles.length],
        preferences: {
          mathLevel: mathLevels[i % mathLevels.length],
          programmingLevel:
            programmingLevels[(i + 1) % programmingLevels.length],
          preferredDomain: preferredDomains[i % preferredDomains.length],
        },
        assessments: [],
        goal:
          i < createdGoals.length ? createdGoals[i]._id : createdGoals[0]._id,
      };
      learnerProfiles.push(profile);
    }

    const createdProfiles = await LearnerProfile.create(learnerProfiles);
    logger.info(`Created ${createdProfiles.length} learner profiles`);

    // Créer quelques pathways actifs pour certains utilisateurs
    const pathways = [];
    for (let i = 0; i < Math.min(3, userList.length); i++) {
      const pathway = {
        userId: userList[i]._id,
        goalId: createdGoals[i % createdGoals.length]._id,
        status: "active",
        progress: Math.floor(Math.random() * 30) + 10,
        currentModule: 0,
        moduleProgress: createdGoals[i % createdGoals.length].modules.map(
          (module, index) => ({
            moduleIndex: index,
            completed: false,
            locked: index > 0,
            resources: module.resources.map((resource, rIndex) => ({
              resourceId: resource._id.toString(),
              completed: index === 0 && rIndex === 0,
              completedAt: index === 0 && rIndex === 0 ? new Date() : null,
            })),
            quiz: {
              completed: false,
              score: 0,
              completedAt: null,
            },
          })
        ),
        startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Il y a 7 jours
        lastAccessedAt: new Date(),
        estimatedCompletionDate: new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000
        ), // Dans 90 jours
        adaptiveRecommendations: [
          {
            type: "resource",
            description: "Réviser les concepts de base en algèbre linéaire",
            priority: "high",
            status: "pending",
          },
          {
            type: "practice",
            description: "Compléter 5 exercices sur les régressions",
            priority: "medium",
            status: "pending",
          },
        ],
        nextGoals: i < createdGoals.length - 1 ? [createdGoals[i + 1]._id] : [],
      };
      pathways.push(pathway);
    }

    if (pathways.length > 0) {
      const createdPathways = await Pathway.create(pathways);
      logger.info(`Created ${createdPathways.length} pathways`);
    }

    // Afficher le résumé
    logger.info("\n=== 📊 Résumé de la base de données ===");
    logger.info(`👥 Utilisateurs: ${createdUsers.length}`);
    logger.info(`🧠 Concepts: ${createdConcepts.length}`);
    logger.info(`🎯 Parcours d'apprentissage: ${createdGoals.length}`);
    logger.info(`📝 Quiz: ${createdQuizzes.length}`);
    logger.info(`📊 Évaluations: ${createdAssessments.length}`);
    logger.info(`👤 Profils d'apprenants: ${createdProfiles.length}`);
    logger.info(`🛤️  Pathways actifs: ${pathways.length}`);

    logger.info("\n✅ Database population completed successfully!");
  } catch (error) {
    logger.error("Error populating database:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Lancer le script
populateDatabase().catch(error => {
  logger.error("Fatal error during database population:", error);
  process.exit(1);
});
