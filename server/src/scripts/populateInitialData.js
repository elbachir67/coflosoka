import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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
    logger.info("Connected to MongoDB for data population");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

async function clearDatabase() {
  try {
    await User.deleteMany({});
    await Goal.deleteMany({});
    await Assessment.deleteMany({});
    await Quiz.deleteMany({});
    await LearnerProfile.deleteMany({});
    await Pathway.deleteMany({});
    await Concept.deleteMany({});
    logger.info("Database cleared");
  } catch (error) {
    logger.error("Error clearing database:", error);
  }
}

async function createUsers() {
  try {
    const users = [
      {
        email: "student@ucad.edu.sn",
        password: "Student123!",
        role: "user",
      },
      {
        email: "student1@ucad.edu.sn",
        password: "Student123!",
        role: "user",
      },
      {
        email: "student2@ucad.edu.sn",
        password: "Student123!",
        role: "user",
      },
      {
        email: "marie.fall@ucad.edu.sn",
        password: "Marie123!",
        role: "user",
      },
      {
        email: "ousmane.sow@ucad.edu.sn",
        password: "Ousmane123!",
        role: "user",
      },
      {
        email: "fatou.ba@ucad.edu.sn",
        password: "Fatou123!",
        role: "user",
      },
      {
        email: "ibrahim.diop@ucad.edu.sn",
        password: "Ibrahim123!",
        role: "user",
      },
      {
        email: "aissatou.ndiaye@ucad.edu.sn",
        password: "Aissatou123!",
        role: "user",
      },
      {
        email: "mamadou.kane@ucad.edu.sn",
        password: "Mamadou123!",
        role: "user",
      },
      {
        email: "admin@ucad.edu.sn",
        password: "Admin123!",
        role: "admin",
      },
      {
        email: "prof.diallo@ucad.edu.sn",
        password: "Prof123!",
        role: "admin",
      },
      {
        email: "prof.ndiaye@ucad.edu.sn",
        password: "Prof123!",
        role: "admin",
      },
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      logger.info(`User created: ${userData.email}`);
    }
  } catch (error) {
    logger.error("Error creating users:", error);
  }
}

async function createConcepts() {
  try {
    const concepts = [
      // Mathématiques
      {
        name: "Algèbre Linéaire pour l'IA",
        description:
          "Vecteurs, matrices, transformations linéaires, décomposition SVD, valeurs propres essentiels pour l'IA",
        category: "math",
        level: "basic",
        prerequisites: [],
      },
      {
        name: "Calcul Différentiel et Intégral",
        description:
          "Dérivées partielles, gradients, règle de la chaîne, optimisation continue pour le ML",
        category: "math",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Probabilités et Statistiques",
        description:
          "Distributions, théorème de Bayes, tests d'hypothèses, inférence statistique",
        category: "math",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Optimisation Mathématique",
        description:
          "Méthodes du gradient, optimisation convexe, lagrangiens, conditions KKT",
        category: "math",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Théorie de l'Information",
        description:
          "Entropie de Shannon, information mutuelle, divergence KL, compression",
        category: "math",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Statistiques Bayésiennes",
        description:
          "Inférence bayésienne, MCMC, priors conjugués, modèles hiérarchiques",
        category: "math",
        level: "advanced",
        prerequisites: [],
      },

      // Programmation
      {
        name: "Python Fondamentaux",
        description:
          "Syntaxe Python, structures de données, POO, gestion d'exceptions, modules",
        category: "programming",
        level: "basic",
        prerequisites: [],
      },
      {
        name: "Python pour la Data Science",
        description:
          "NumPy, Pandas, Matplotlib, Seaborn, Jupyter notebooks, manipulation de données",
        category: "programming",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "SQL et Bases de Données",
        description:
          "Requêtes SQL complexes, joins, optimisation, NoSQL (MongoDB), bases distribuées",
        category: "programming",
        level: "basic",
        prerequisites: [],
      },
      {
        name: "Git et Collaboration",
        description:
          "Versioning, branches, merge/rebase, workflows collaboratifs, GitHub/GitLab",
        category: "programming",
        level: "basic",
        prerequisites: [],
      },

      // Machine Learning
      {
        name: "Introduction au Machine Learning",
        description:
          "Types d'apprentissage, workflow ML, métriques d'évaluation, validation croisée",
        category: "ml",
        level: "basic",
        prerequisites: [],
      },
      {
        name: "Apprentissage Supervisé",
        description:
          "Classification, régression, arbres de décision, SVM, évaluation de modèles",
        category: "ml",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Apprentissage Non Supervisé",
        description:
          "Clustering (K-means, hierarchique), réduction de dimension (PCA, t-SNE), détection d'anomalies",
        category: "ml",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Feature Engineering",
        description:
          "Sélection de features, transformation, création, gestion des données manquantes",
        category: "ml",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Ensemble Methods",
        description:
          "Random Forest, Gradient Boosting, XGBoost, LightGBM, stacking",
        category: "ml",
        level: "advanced",
        prerequisites: [],
      },

      // Deep Learning
      {
        name: "Réseaux de Neurones",
        description:
          "Perceptron, backpropagation, fonctions d'activation, architectures feedforward",
        category: "dl",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "CNN - Vision par Ordinateur",
        description:
          "Convolutions, pooling, architectures CNN (ResNet, VGG, EfficientNet)",
        category: "dl",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "RNN et Séquences",
        description:
          "LSTM, GRU, seq2seq, applications temporelles et séquentielles",
        category: "dl",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Transformers et Attention",
        description: "Mécanisme d'attention, BERT, GPT, Vision Transformers",
        category: "dl",
        level: "advanced",
        prerequisites: [],
      },

      // Computer Vision
      {
        name: "Traitement d'Images Fondamental",
        description:
          "Filtrage, morphologie mathématique, transformations géométriques, histogrammes",
        category: "computer_vision",
        level: "basic",
        prerequisites: [],
      },
      {
        name: "Détection d'Objets",
        description: "YOLO, R-CNN, SSD, métriques mAP, Non-Maximum Suppression",
        category: "computer_vision",
        level: "advanced",
        prerequisites: [],
      },
      {
        name: "Segmentation d'Images",
        description:
          "U-Net, Mask R-CNN, segmentation sémantique vs instance, métriques IoU",
        category: "computer_vision",
        level: "advanced",
        prerequisites: [],
      },

      // NLP
      {
        name: "NLP Fondamental",
        description:
          "Tokenisation, stemming, lemmatisation, POS tagging, parsing syntaxique",
        category: "nlp",
        level: "basic",
        prerequisites: [],
      },
      {
        name: "Word Embeddings",
        description:
          "Word2Vec, GloVe, FastText, représentations vectorielles contextuelles",
        category: "nlp",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Analyse de Sentiment",
        description:
          "Classification de texte, polarité, analyse d'aspects, datasets annotés",
        category: "nlp",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Named Entity Recognition",
        description:
          "Extraction d'entités nommées, modèles CRF, BiLSTM-CRF, spaCy",
        category: "nlp",
        level: "intermediate",
        prerequisites: [],
      },

      // MLOps
      {
        name: "Containerisation ML",
        description:
          "Docker pour ML, Kubernetes, orchestration d'applications ML",
        category: "mlops",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Pipelines ML",
        description:
          "MLflow, Kubeflow, DVC, orchestration de workflows ML, CI/CD",
        category: "mlops",
        level: "intermediate",
        prerequisites: [],
      },
      {
        name: "Monitoring de Modèles",
        description:
          "Drift detection, performance monitoring, alerting, observabilité",
        category: "mlops",
        level: "advanced",
        prerequisites: [],
      },
    ];

    for (const conceptData of concepts) {
      const concept = new Concept(conceptData);
      await concept.save();
      logger.info(`Concept created: ${conceptData.name}`);
    }

    // Définir les relations de prérequis
    const prerequisites = {
      "Calcul Différentiel et Intégral": ["Algèbre Linéaire pour l'IA"],
      "Probabilités et Statistiques": ["Calcul Différentiel et Intégral"],
      "Optimisation Mathématique": [
        "Calcul Différentiel et Intégral",
        "Algèbre Linéaire pour l'IA",
      ],
      "Statistiques Bayésiennes": ["Probabilités et Statistiques"],
      "Python pour la Data Science": ["Python Fondamentaux"],
      "Introduction au Machine Learning": [
        "Python pour la Data Science",
        "Probabilités et Statistiques",
      ],
      "Apprentissage Supervisé": ["Introduction au Machine Learning"],
      "Apprentissage Non Supervisé": ["Introduction au Machine Learning"],
      "Feature Engineering": ["Apprentissage Supervisé"],
      "Ensemble Methods": ["Apprentissage Supervisé", "Feature Engineering"],
      "Réseaux de Neurones": [
        "Apprentissage Supervisé",
        "Optimisation Mathématique",
      ],
      "CNN - Vision par Ordinateur": [
        "Réseaux de Neurones",
        "Traitement d'Images Fondamental",
      ],
      "RNN et Séquences": ["Réseaux de Neurones"],
      "Transformers et Attention": ["RNN et Séquences"],
      "Détection d'Objets": ["CNN - Vision par Ordinateur"],
      "Segmentation d'Images": ["CNN - Vision par Ordinateur"],
      "Word Embeddings": ["NLP Fondamental", "Algèbre Linéaire pour l'IA"],
      "Analyse de Sentiment": ["Word Embeddings"],
      "Named Entity Recognition": ["Word Embeddings"],
      "Pipelines ML": ["Containerisation ML"],
      "Monitoring de Modèles": ["Pipelines ML"],
    };

    // Mettre à jour les prérequis
    const allConcepts = await Concept.find();
    const conceptMap = {};
    allConcepts.forEach(concept => {
      conceptMap[concept.name] = concept._id;
    });

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
  } catch (error) {
    logger.error("Error creating concepts:", error);
  }
}

async function createAssessments() {
  try {
    const assessments = [
      {
        title: "Évaluation Mathématiques - Niveau Débutant",
        category: "math",
        difficulty: "basic",
        questions: [
          {
            text: "Quelle est la dérivée de f(x) = x² + 3x + 2 ?",
            options: [
              { text: "2x + 3", isCorrect: true },
              { text: "x² + 3", isCorrect: false },
              { text: "2x + 2", isCorrect: false },
              { text: "x + 3", isCorrect: false },
            ],
            explanation:
              "La dérivée de x² est 2x, la dérivée de 3x est 3, et la dérivée d'une constante est 0.",
          },
          {
            text: "Quelle est la probabilité d'obtenir un 6 en lançant un dé équilibré ?",
            options: [
              { text: "1/6", isCorrect: true },
              { text: "1/3", isCorrect: false },
              { text: "1/2", isCorrect: false },
              { text: "1/4", isCorrect: false },
            ],
            explanation: "Un dé a 6 faces équiprobables, donc P(6) = 1/6.",
          },
          {
            text: "Qu'est-ce qu'un vecteur dans R³ ?",
            options: [
              {
                text: "Un triplet de nombres réels (x, y, z)",
                isCorrect: true,
              },
              { text: "Une fonction de trois variables", isCorrect: false },
              { text: "Une matrice 3x3", isCorrect: false },
              { text: "Un point dans l'espace", isCorrect: false },
            ],
            explanation:
              "Un vecteur dans R³ est représenté par trois coordonnées réelles.",
          },
        ],
        recommendedGoals: [],
      },
      {
        title: "Évaluation Mathématiques - Niveau Intermédiaire",
        category: "math",
        difficulty: "intermediate",
        questions: [
          {
            text: "Qu'est-ce qu'un vecteur propre d'une matrice A ?",
            options: [
              {
                text: "Un vecteur v tel que Av = λv pour un scalaire λ",
                isCorrect: true,
              },
              { text: "Un vecteur de norme 1", isCorrect: false },
              { text: "Un vecteur orthogonal", isCorrect: false },
              { text: "La première colonne de la matrice", isCorrect: false },
            ],
            explanation:
              "Un vecteur propre ne change que d'échelle lors de la multiplication matricielle : Av = λv.",
          },
          {
            text: "Que représente la variance d'une variable aléatoire ?",
            options: [
              {
                text: "E[(X - μ)²] - la dispersion autour de la moyenne",
                isCorrect: true,
              },
              { text: "La valeur moyenne", isCorrect: false },
              { text: "La médiane", isCorrect: false },
              { text: "L'écart-type au carré", isCorrect: false },
            ],
            explanation:
              "La variance mesure la dispersion des valeurs autour de la moyenne : Var(X) = E[(X - μ)²].",
          },
        ],
        recommendedGoals: [],
      },
      {
        title: "Évaluation Programmation - Niveau Débutant",
        category: "programming",
        difficulty: "basic",
        questions: [
          {
            text: "Quelle est la différence entre une liste et un tuple en Python ?",
            options: [
              {
                text: "Les listes sont mutables, les tuples sont immutables",
                isCorrect: true,
              },
              { text: "Les listes sont plus rapides", isCorrect: false },
              {
                text: "Les tuples peuvent contenir plus d'éléments",
                isCorrect: false,
              },
              { text: "Il n'y a pas de différence", isCorrect: false },
            ],
            explanation:
              "Les listes peuvent être modifiées après création, contrairement aux tuples.",
          },
          {
            text: "Que fait cette compréhension de liste : [x**2 for x in range(5) if x % 2 == 0] ?",
            options: [
              {
                text: "Retourne [0, 4, 16] - les carrés des nombres pairs",
                isCorrect: true,
              },
              { text: "Retourne [0, 1, 4, 9, 16]", isCorrect: false },
              { text: "Retourne [2, 4]", isCorrect: false },
              { text: "Produit une erreur", isCorrect: false },
            ],
            explanation:
              "Elle filtre les nombres pairs (0, 2, 4) dans range(5) et calcule leur carré.",
          },
        ],
        recommendedGoals: [],
      },
      {
        title: "Évaluation Machine Learning - Fondamentaux",
        category: "ml",
        difficulty: "basic",
        questions: [
          {
            text: "Quelle est la différence principale entre apprentissage supervisé et non supervisé ?",
            options: [
              {
                text: "Le supervisé utilise des labels, le non supervisé découvre des structures",
                isCorrect: true,
              },
              { text: "Le supervisé est plus rapide", isCorrect: false },
              {
                text: "Le non supervisé nécessite plus de données",
                isCorrect: false,
              },
              { text: "Il n'y a pas de différence", isCorrect: false },
            ],
            explanation:
              "L'apprentissage supervisé apprend à partir d'exemples étiquetés, tandis que le non supervisé trouve des patterns dans des données non étiquetées.",
          },
          {
            text: "Qu'est-ce que l'overfitting ?",
            options: [
              {
                text: "Le modèle mémorise les données d'entraînement au lieu de généraliser",
                isCorrect: true,
              },
              { text: "Le modèle apprend trop lentement", isCorrect: false },
              { text: "Le modèle a trop de données", isCorrect: false },
              { text: "Le modèle est trop simple", isCorrect: false },
            ],
            explanation:
              "L'overfitting se produit quand le modèle s'adapte trop aux données d'entraînement et performe mal sur de nouvelles données.",
          },
        ],
        recommendedGoals: [],
      },
      {
        title: "Évaluation Deep Learning",
        category: "dl",
        difficulty: "intermediate",
        questions: [
          {
            text: "Pourquoi la fonction d'activation ReLU est-elle populaire ?",
            options: [
              {
                text: "Elle évite le vanishing gradient et est simple à calculer",
                isCorrect: true,
              },
              { text: "Elle est toujours dérivable", isCorrect: false },
              {
                text: "Elle produit des sorties entre 0 et 1",
                isCorrect: false,
              },
              { text: "Elle est symétrique", isCorrect: false },
            ],
            explanation:
              "ReLU(x) = max(0,x) maintient le gradient pour x > 0, évitant l'atténuation du gradient.",
          },
          {
            text: "Qu'est-ce que la backpropagation ?",
            options: [
              {
                text: "L'algorithme pour calculer les gradients en remontant le réseau",
                isCorrect: true,
              },
              { text: "Une technique de régularisation", isCorrect: false },
              { text: "Une méthode d'initialisation", isCorrect: false },
              { text: "Un type d'optimiseur", isCorrect: false },
            ],
            explanation:
              "La backpropagation calcule les gradients en propageant l'erreur de la sortie vers l'entrée.",
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
            text: "Qu'est-ce qu'une convolution en traitement d'images ?",
            options: [
              {
                text: "Une opération qui applique un filtre pour extraire des caractéristiques",
                isCorrect: true,
              },
              { text: "Une transformation géométrique", isCorrect: false },
              { text: "Une technique de compression", isCorrect: false },
              { text: "Un algorithme de segmentation", isCorrect: false },
            ],
            explanation:
              "La convolution fait glisser un noyau sur l'image pour détecter des motifs locaux.",
          },
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
              "IoU mesure le chevauchement entre la boîte prédite et la vérité terrain.",
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
            text: "Qu'est-ce que la tokenisation en NLP ?",
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
              "La tokenisation décompose le texte en tokens manipulables par les algorithmes.",
          },
          {
            text: "Qu'est-ce qu'un word embedding ?",
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
              "Les embeddings projettent les mots dans un espace vectoriel dense.",
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
            text: "Qu'est-ce que le model drift ?",
            options: [
              {
                text: "Dégradation des performances due aux changements dans les données",
                isCorrect: true,
              },
              { text: "Un bug dans le code du modèle", isCorrect: false },
              { text: "L'augmentation de la latence", isCorrect: false },
              { text: "La corruption des poids", isCorrect: false },
            ],
            explanation:
              "Le drift survient quand la distribution des données change par rapport à l'entraînement.",
          },
          {
            text: "Pourquoi utiliser Docker pour les applications ML ?",
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
              "Docker garantit que l'environnement est identique partout.",
          },
        ],
        recommendedGoals: [],
      },
    ];

    for (const assessmentData of assessments) {
      const assessment = new Assessment(assessmentData);
      await assessment.save();
      logger.info(`Assessment created: ${assessmentData.title}`);
    }
  } catch (error) {
    logger.error("Error creating assessments:", error);
  }
}

async function createGoals() {
  try {
    const goals = [
      {
        title: "Ingénieur Machine Learning",
        description:
          "Formation complète pour devenir ML Engineer avec expertise production",
        category: "ml",
        level: "intermediate",
        estimatedDuration: 12,
        prerequisites: [
          {
            category: "math",
            skills: [
              { name: "Algèbre linéaire", level: "intermediate" },
              { name: "Probabilités", level: "intermediate" },
              { name: "Calcul différentiel", level: "basic" },
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
            title: "Fondamentaux du Machine Learning",
            description: "Concepts théoriques et pratiques de base",
            duration: 20,
            skills: [
              { name: "Scikit-learn", level: "intermediate" },
              { name: "Validation croisée", level: "intermediate" },
              { name: "Métriques ML", level: "intermediate" },
            ],
            resources: [
              {
                title: "Machine Learning Course - Andrew Ng (Coursera)",
                type: "course",
                url: "https://www.coursera.org/learn/machine-learning",
                duration: 120,
              },
              {
                title: "Hands-On Machine Learning - Aurélien Géron",
                type: "book",
                url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/",
                duration: 180,
              },
              {
                title: "Scikit-learn User Guide",
                type: "article",
                url: "https://scikit-learn.org/stable/user_guide.html",
                duration: 60,
              },
              {
                title: "Machine Learning Mastery",
                type: "article",
                url: "https://machinelearningmastery.com/start-here/",
                duration: 40,
              },
              {
                title: "Projet: Prédiction Prix Immobilier",
                type: "use_case",
                url: "https://www.kaggle.com/c/house-prices-advanced-regression-techniques",
                duration: 50,
              },
            ],
            validationCriteria: [
              "Comprendre les différences entre apprentissage supervisé et non supervisé",
              "Implémenter une pipeline ML complète avec validation croisée",
              "Diagnostiquer et corriger l'overfitting/underfitting",
              "Atteindre un score satisfaisant sur le projet Kaggle",
            ],
          },
          {
            title: "Python et Écosystème Data Science",
            description: "Maîtrise des outils Python pour la data science",
            duration: 15,
            skills: [
              { name: "NumPy", level: "advanced" },
              { name: "Pandas", level: "advanced" },
              { name: "Matplotlib/Seaborn", level: "intermediate" },
            ],
            resources: [
              {
                title: "Python Data Science Handbook",
                type: "book",
                url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
                duration: 150,
              },
              {
                title: "Pandas Official Documentation",
                type: "article",
                url: "https://pandas.pydata.org/docs/user_guide/index.html",
                duration: 80,
              },
              {
                title: "NumPy Fundamentals",
                type: "course",
                url: "https://numpy.org/learn/",
                duration: 60,
              },
              {
                title: "Data Visualization with Python",
                type: "article",
                url: "https://realpython.com/python-data-visualization/",
                duration: 40,
              },
            ],
            validationCriteria: [
              "Manipuler efficacement des DataFrames complexes",
              "Créer des visualisations informatives",
              "Optimiser les performances avec NumPy",
              "Nettoyer et préparer des données réelles",
            ],
          },
          {
            title: "Algorithmes ML Avancés",
            description: "Méthodes d'ensemble et techniques avancées",
            duration: 25,
            skills: [
              { name: "Random Forest", level: "advanced" },
              { name: "XGBoost/LightGBM", level: "advanced" },
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
                url: "https://xgboost.readthedocs.io/en/stable/",
                duration: 80,
              },
              {
                title: "Feature Engineering for Machine Learning",
                type: "book",
                url: "https://www.oreilly.com/library/view/feature-engineering-for/9781491953235/",
                duration: 120,
              },
              {
                title: "Ensemble Methods in Data Mining",
                type: "article",
                url: "https://link.springer.com/book/10.1007/978-3-031-01899-2",
                duration: 60,
              },
            ],
            validationCriteria: [
              "Implémenter et optimiser des modèles d'ensemble",
              "Maîtriser le feature engineering automatisé",
              "Gérer les données déséquilibrées efficacement",
              "Obtenir des performances compétitives sur des datasets réels",
            ],
          },
          {
            title: "MLOps et Production",
            description: "Déploiement et maintenance de modèles ML",
            duration: 20,
            skills: [
              { name: "Docker", level: "intermediate" },
              { name: "FastAPI", level: "intermediate" },
              { name: "MLflow", level: "intermediate" },
            ],
            resources: [
              {
                title: "Building ML Powered Applications",
                type: "book",
                url: "https://www.oreilly.com/library/view/building-machine-learning/9781492045106/",
                duration: 140,
              },
              {
                title: "MLOps Specialization - DeepLearning.AI",
                type: "course",
                url: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops",
                duration: 120,
              },
              {
                title: "FastAPI Documentation",
                type: "article",
                url: "https://fastapi.tiangolo.com/tutorial/",
                duration: 60,
              },
              {
                title: "MLflow Tracking",
                type: "article",
                url: "https://mlflow.org/docs/latest/tracking.html",
                duration: 40,
              },
            ],
            validationCriteria: [
              "Créer une API ML robuste",
              "Containeriser et déployer sur cloud",
              "Implémenter monitoring de modèles",
              "Mettre en place un pipeline CI/CD",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "Machine Learning Engineer",
            description:
              "Développement et déploiement de modèles ML en production",
            averageSalary: "45-75k€/an (Sénégal), 75-125k€/an (International)",
            companies: [
              "Google",
              "Amazon",
              "Meta",
              "Expensya",
              "Orange Digital Center",
            ],
          },
          {
            title: "Data Scientist",
            description: "Analyse de données et modélisation prédictive",
            averageSalary: "40-70k€/an (Sénégal), 70-110k€/an (International)",
            companies: ["Netflix", "Uber", "Airbnb", "Sonatel", "BCEAO"],
          },
        ],
        certification: {
          available: true,
          name: "Certificat ML Engineer Professional UCAD",
          provider: "UCAD AI Center",
          url: "https://ucad.sn/certifications/ml-engineer",
        },
        requiredConcepts: [],
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
            description: "Théorie et implémentation from scratch",
            duration: 25,
            skills: [
              { name: "PyTorch", level: "advanced" },
              { name: "Backpropagation", level: "advanced" },
              { name: "Optimisation DL", level: "intermediate" },
            ],
            resources: [
              {
                title: "Deep Learning - Ian Goodfellow",
                type: "book",
                url: "https://www.deeplearningbook.org/",
                duration: 250,
              },
              {
                title: "CS231n: CNN for Visual Recognition",
                type: "course",
                url: "http://cs231n.stanford.edu/",
                duration: 200,
              },
              {
                title: "PyTorch Official Tutorials",
                type: "article",
                url: "https://pytorch.org/tutorials/",
                duration: 100,
              },
              {
                title: "Neural Networks and Deep Learning",
                type: "course",
                url: "https://www.coursera.org/learn/neural-networks-deep-learning",
                duration: 120,
              },
            ],
            validationCriteria: [
              "Implémenter un réseau de neurones from scratch",
              "Maîtriser PyTorch pour architectures complexes",
              "Comprendre théoriquement la backpropagation",
              "Optimiser l'entraînement de modèles profonds",
            ],
          },
          {
            title: "Vision par Ordinateur avec CNN",
            description: "Applications CNN pour l'analyse d'images",
            duration: 30,
            skills: [
              { name: "CNN architectures", level: "advanced" },
              { name: "Transfer Learning", level: "intermediate" },
              { name: "Data Augmentation", level: "intermediate" },
            ],
            resources: [
              {
                title: "Computer Vision: Models, Learning, and Inference",
                type: "book",
                url: "http://www.computervisionmodels.com/",
                duration: 180,
              },
              {
                title: "Practical Deep Learning for Coders",
                type: "course",
                url: "https://course.fast.ai/",
                duration: 160,
              },
              {
                title: "OpenCV Python Tutorial",
                type: "article",
                url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",
                duration: 80,
              },
            ],
            validationCriteria: [
              "Implémenter ResNet, VGG, EfficientNet",
              "Utiliser le transfer learning efficacement",
              "Créer un système de classification d'images",
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
                title: "CS224n: Natural Language Processing with Deep Learning",
                type: "course",
                url: "http://web.stanford.edu/class/cs224n/",
                duration: 180,
              },
              {
                title: "Hugging Face NLP Course",
                type: "course",
                url: "https://huggingface.co/learn/nlp-course",
                duration: 120,
              },
              {
                title: "Attention Is All You Need - Paper",
                type: "article",
                url: "https://arxiv.org/abs/1706.03762",
                duration: 30,
              },
              {
                title: "The Illustrated Transformer",
                type: "article",
                url: "https://jalammar.github.io/illustrated-transformer/",
                duration: 40,
              },
            ],
            validationCriteria: [
              "Comprendre l'architecture Transformer",
              "Fine-tuner BERT pour une tâche spécifique",
              "Implémenter un système de QA",
              "Optimiser l'inférence de grands modèles",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "Deep Learning Engineer",
            description: "Développement de systèmes DL complexes",
            averageSalary: "55-90k€/an (Sénégal), 90-160k€/an (International)",
            companies: [
              "DeepMind",
              "OpenAI",
              "NVIDIA",
              "Tesla",
              "Hugging Face",
            ],
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
        description:
          "Analyse de données, statistiques et communication d'insights",
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
            description: "EDA, visualisation et storytelling",
            duration: 20,
            skills: [
              { name: "Pandas", level: "advanced" },
              { name: "Visualization", level: "advanced" },
              { name: "Statistical Tests", level: "intermediate" },
            ],
            resources: [
              {
                title: "Python for Data Analysis - Wes McKinney",
                type: "book",
                url: "https://wesmckinney.com/book/",
                duration: 150,
              },
              {
                title: "Storytelling with Data",
                type: "book",
                url: "https://www.storytellingwithdata.com/",
                duration: 100,
              },
              {
                title: "Seaborn Tutorial",
                type: "article",
                url: "https://seaborn.pydata.org/tutorial.html",
                duration: 60,
              },
            ],
            validationCriteria: [
              "Réaliser une EDA complète",
              "Créer des visualisations impactantes",
              "Identifier patterns et anomalies",
              "Communiquer des insights clairement",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "Data Scientist",
            description: "Analyse et modélisation pour insights business",
            averageSalary: "40-70k€/an (Sénégal), 70-110k€/an (International)",
            companies: ["Airbnb", "Netflix", "Uber", "BCEAO", "Sonatel"],
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
        title: "Expert Computer Vision",
        description:
          "Spécialisation en vision par ordinateur et analyse d'images",
        category: "computer_vision",
        level: "advanced",
        estimatedDuration: 14,
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
            title: "Traitement d'Images et Vision Classique",
            description: "Fondements et algorithmes classiques",
            duration: 20,
            skills: [
              { name: "OpenCV", level: "advanced" },
              { name: "Image Processing", level: "advanced" },
            ],
            resources: [
              {
                title:
                  "Computer Vision: Algorithms and Applications - Szeliski",
                type: "book",
                url: "https://szeliski.org/Book/",
                duration: 200,
              },
              {
                title: "OpenCV Python Tutorials",
                type: "article",
                url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",
                duration: 80,
              },
            ],
            validationCriteria: [
              "Maîtriser les transformations d'images",
              "Implémenter des détecteurs de features",
              "Réaliser calibration de caméra",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "Computer Vision Engineer",
            description: "Applications industrielles de la vision",
            averageSalary: "50-85k€/an",
            companies: ["Tesla", "Apple", "Google", "Microsoft"],
          },
        ],
        certification: {
          available: true,
          name: "Computer Vision Specialist",
          provider: "UCAD AI Center",
          url: "https://ucad.sn/certifications/cv-specialist",
        },
        requiredConcepts: [],
      },

      {
        title: "Ingénieur NLP",
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
            skills: [{ name: "Deep Learning", level: "intermediate" }],
          },
        ],
        modules: [
          {
            title: "Fondamentaux du NLP",
            description: "Bases du traitement du langage",
            duration: 20,
            skills: [
              { name: "NLTK/spaCy", level: "intermediate" },
              { name: "Text Processing", level: "advanced" },
            ],
            resources: [
              {
                title: "Speech and Language Processing - Jurafsky",
                type: "book",
                url: "https://web.stanford.edu/~jurafsky/slp3/",
                duration: 200,
              },
              {
                title: "spaCy Course",
                type: "course",
                url: "https://course.spacy.io/",
                duration: 80,
              },
            ],
            validationCriteria: [
              "Maîtriser tokenization et preprocessing",
              "Implémenter POS tagging et NER",
              "Créer des pipelines de traitement",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "NLP Engineer",
            description: "Développement de systèmes NLP",
            averageSalary: "55-90k€/an",
            companies: ["Google", "OpenAI", "Anthropic", "Hugging Face"],
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
            description: "Containerisation et orchestration",
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
                title: "Kubernetes Documentation",
                type: "article",
                url: "https://kubernetes.io/docs/tutorials/",
                duration: 100,
              },
            ],
            validationCriteria: [
              "Containeriser des applications ML",
              "Déployer sur Kubernetes",
              "Utiliser les services cloud ML",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "MLOps Engineer",
            description: "Opérationnalisation des systèmes ML",
            averageSalary: "50-85k€/an",
            companies: ["Google", "AWS", "Microsoft", "Databricks"],
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
    ];

    for (const goalData of goals) {
      const goal = new Goal(goalData);
      await goal.save();
      logger.info(`Goal created: ${goalData.title}`);
    }
  } catch (error) {
    logger.error("Error creating goals:", error);
  }
}

async function createQuizzes() {
  try {
    const goals = await Goal.find();

    // Quiz techniques spécialisés par module et ressources
    const technicalQuizTemplates = {
      "Fondamentaux du Machine Learning": [
        {
          text: "Après avoir étudié le cours d'Andrew Ng, expliquez pourquoi on utilise la fonction de coût J(θ) = (1/2m) Σ(hθ(x) - y)² en régression linéaire ?",
          options: [
            {
              text: "Pour mesurer l'écart quadratique moyen entre prédictions et valeurs réelles",
              isCorrect: true,
            },
            {
              text: "Pour calculer la dérivée de la fonction d'hypothèse",
              isCorrect: false,
            },
            { text: "Pour normaliser les données d'entrée", isCorrect: false },
            { text: "Pour initialiser les paramètres θ", isCorrect: false },
          ],
          explanation:
            "La fonction de coût quadratique pénalise les erreurs de prédiction de manière proportionnelle au carré de l'erreur, facilitant l'optimisation par gradient descent.",
        },
        {
          text: "Dans scikit-learn, quelle différence entre train_test_split() et StratifiedShuffleSplit() ?",
          options: [
            {
              text: "StratifiedShuffleSplit préserve la proportion des classes dans les splits",
              isCorrect: true,
            },
            { text: "train_test_split est plus rapide", isCorrect: false },
            {
              text: "StratifiedShuffleSplit ne mélange pas les données",
              isCorrect: false,
            },
            { text: "Il n'y a pas de différence", isCorrect: false },
          ],
          explanation:
            "StratifiedShuffleSplit garantit que chaque split conserve la même proportion de classes que le dataset original, crucial pour les datasets déséquilibrés.",
        },
        {
          text: "En implémentant la validation croisée k-fold, pourquoi éviter k=n (leave-one-out) sur de gros datasets ?",
          options: [
            {
              text: "Coût computationnel trop élevé et variance élevée de l'estimation",
              isCorrect: true,
            },
            { text: "Résultats moins précis", isCorrect: false },
            { text: "Impossible à implémenter", isCorrect: false },
            { text: "Pas de parallélisation possible", isCorrect: false },
          ],
          explanation:
            "LOOCV nécessite n entraînements du modèle et produit une estimation avec haute variance. k=5 ou k=10 offrent un bon compromis biais-variance.",
        },
        {
          text: "Selon le livre 'Hands-On Machine Learning', comment détecter l'overfitting dans un pipeline ML ?",
          options: [
            {
              text: "Écart important entre score train et validation + courbes d'apprentissage",
              isCorrect: true,
            },
            {
              text: "Score de validation supérieur au score train",
              isCorrect: false,
            },
            { text: "Temps d'entraînement trop long", isCorrect: false },
            { text: "Nombreux paramètres dans le modèle", isCorrect: false },
          ],
          explanation:
            "L'overfitting se manifeste par un grand écart train/validation et des courbes d'apprentissage qui divergent avec plus de données.",
        },
        {
          text: "Dans le projet Kaggle House Prices, quelle technique pour gérer les features catégorielles à haute cardinalité ?",
          options: [
            {
              text: "Target encoding ou embedding, pas one-hot encoding",
              isCorrect: true,
            },
            { text: "One-hot encoding systématique", isCorrect: false },
            { text: "Label encoding simple", isCorrect: false },
            { text: "Supprimer ces features", isCorrect: false },
          ],
          explanation:
            "Pour des catégories nombreuses (>10-15), target encoding ou embeddings évitent l'explosion dimensionnelle du one-hot encoding.",
        },
      ],

      "Python et Écosystème Data Science": [
        {
          text: "Selon le Python Data Science Handbook, quelle différence entre .copy() et .copy(deep=True) sur un DataFrame ?",
          options: [
            {
              text: ".copy() copie la structure mais partage les données, deep=True copie tout",
              isCorrect: true,
            },
            { text: "Aucune différence pratique", isCorrect: false },
            { text: ".copy() est plus rapide", isCorrect: false },
            {
              text: "deep=True ne fonctionne qu'avec les objets",
              isCorrect: false,
            },
          ],
          explanation:
            "copy() crée une shallow copy (nouvelles métadonnées mais même données en mémoire), deep=True copie aussi les données.",
        },
        {
          text: "Pour optimiser les performances pandas sur de gros datasets, quelle stratégie recommande la documentation officielle ?",
          options: [
            {
              text: "Spécifier les dtypes, utiliser chunksize, et vectoriser les opérations",
              isCorrect: true,
            },
            { text: "Augmenter seulement la RAM", isCorrect: false },
            { text: "Utiliser plus de boucles for", isCorrect: false },
            { text: "Convertir en listes Python", isCorrect: false },
          ],
          explanation:
            "dtype optimization évite l'inférence, chunksize permet le traitement par blocs, la vectorisation évite les boucles Python lentes.",
        },
        {
          text: "Dans NumPy, pourquoi np.dot(A, B) est-il différent de A * B pour les matrices ?",
          options: [
            {
              text: "np.dot fait la multiplication matricielle, * fait l'element-wise",
              isCorrect: true,
            },
            { text: "np.dot est plus lent", isCorrect: false },
            { text: "* ne fonctionne qu'avec les scalaires", isCorrect: false },
            { text: "Il n'y a pas de différence", isCorrect: false },
          ],
          explanation:
            "np.dot(A,B) calcule le produit matriciel Σ(A[i,k] * B[k,j]), tandis que A*B multiplie élément par élément.",
        },
        {
          text: "En suivant le tutorial de visualisation de données, quel est l'avantage de seaborn sur matplotlib ?",
          options: [
            {
              text: "API plus simple, thèmes intégrés, et fonctions statistiques directes",
              isCorrect: true,
            },
            { text: "Plus rapide pour le rendu", isCorrect: false },
            { text: "Supporte plus de formats", isCorrect: false },
            { text: "Meilleure résolution", isCorrect: false },
          ],
          explanation:
            "Seaborn simplifie la création de visualisations statistiques avec des fonctions comme regplot(), boxplot() et des thèmes esthétiques.",
        },
      ],

      "Fondamentaux des Réseaux de Neurones": [
        {
          text: "Selon le livre 'Deep Learning' de Goodfellow, pourquoi la fonction sigmoid cause-t-elle le vanishing gradient ?",
          options: [
            {
              text: "Sa dérivée max est 0.25, atténuant les gradients dans les couches profondes",
              isCorrect: true,
            },
            { text: "Elle produit des sorties négatives", isCorrect: false },
            { text: "Elle est non-dérivable en 0", isCorrect: false },
            { text: "Elle converge trop lentement", isCorrect: false },
          ],
          explanation:
            "sigmoid'(x) = sigmoid(x)(1-sigmoid(x)) atteint son maximum de 0.25 en x=0, causant une atténuation exponentielle des gradients.",
        },
        {
          text: "Dans PyTorch, quelle différence entre loss.backward() et loss.backward(retain_graph=True) ?",
          options: [
            {
              text: "retain_graph=True garde le graphe pour des backward() multiples",
              isCorrect: true,
            },
            {
              text: "retain_graph=True calcule plus de dérivées",
              isCorrect: false,
            },
            { text: "Pas de différence pratique", isCorrect: false },
            { text: "retain_graph=True est plus rapide", isCorrect: false },
          ],
          explanation:
            "Par défaut, PyTorch libère le graphe de calcul après backward(). retain_graph=True le préserve pour des appels supplémentaires.",
        },
        {
          text: "En implémentant la backpropagation from scratch, comment calculer ∂L/∂W pour une couche fully connected ?",
          options: [
            {
              text: "∂L/∂W = ∂L/∂z * ∂z/∂W = δ * x^T (produit externe)",
              isCorrect: true,
            },
            { text: "∂L/∂W = δ * W", isCorrect: false },
            { text: "∂L/∂W = x * δ", isCorrect: false },
            { text: "∂L/∂W = σ'(z) * δ", isCorrect: false },
          ],
          explanation:
            "Pour z = Wx + b, ∂z/∂W = x. Donc ∂L/∂W = δ ⊗ x où δ est l'erreur rétropropagée et ⊗ le produit externe.",
        },
        {
          text: "Selon le cours CS231n, pourquoi initialiser les poids avec Xavier/Glorot initialization ?",
          options: [
            {
              text: "Maintient la variance des activations constante à travers les couches",
              isCorrect: true,
            },
            { text: "Accélère la convergence seulement", isCorrect: false },
            { text: "Évite l'overfitting", isCorrect: false },
            { text: "Réduit le coût computationnel", isCorrect: false },
          ],
          explanation:
            "Xavier init utilise Var(W) = 1/n_in pour que Var(output) ≈ Var(input), évitant l'explosion/vanishing des activations.",
        },
      ],

      "Traitement d'Images et Vision Classique": [
        {
          text: "En utilisant OpenCV, pourquoi cv2.GaussianBlur() avant cv2.Canny() pour la détection de contours ?",
          options: [
            {
              text: "Réduire le bruit qui cause des faux contours",
              isCorrect: true,
            },
            { text: "Augmenter la résolution", isCorrect: false },
            { text: "Accélérer l'algorithme Canny", isCorrect: false },
            { text: "Améliorer le contraste", isCorrect: false },
          ],
          explanation:
            "Le bruit cause des gradients locaux parasites. Le lissage gaussien supprime ces variations haute fréquence avant la détection de contours.",
        },
        {
          text: "Selon le livre de Szeliski, comment fonctionne la calibration de caméra avec l'algorithme de Zhang ?",
          options: [
            {
              text: "Utilise un pattern plan 2D vu sous différents angles pour estimer la matrice intrinsèque",
              isCorrect: true,
            },
            {
              text: "Nécessite un objet 3D de dimensions connues",
              isCorrect: false,
            },
            { text: "Fonctionne avec une seule image", isCorrect: false },
            { text: "Calibre seulement la distorsion", isCorrect: false },
          ],
          explanation:
            "Zhang's method exploite les contraintes géométriques d'un pattern 2D (échiquier) observé sous multiples poses pour récupérer K et les extrinsèques.",
        },
        {
          text: "Dans cv2.findHomography(), quelle différence entre RANSAC et LEAST_SQUARES ?",
          options: [
            {
              text: "RANSAC est robuste aux outliers, LEAST_SQUARES assume tous les points corrects",
              isCorrect: true,
            },
            { text: "LEAST_SQUARES est plus précis", isCorrect: false },
            { text: "RANSAC est plus rapide", isCorrect: false },
            { text: "Pas de différence pratique", isCorrect: false },
          ],
          explanation:
            "RANSAC échantillonne itérativement des sous-ensembles pour trouver le modèle avec le plus d'inliers, résistant aux mauvaises correspondances.",
        },
      ],

      "Fondamentaux du NLP": [
        {
          text: "Selon le livre de Jurafsky, pourquoi utiliser BPE (Byte Pair Encoding) plutôt qu'une tokenisation par mots ?",
          options: [
            {
              text: "Gère les mots rares et hors vocabulaire en décomposant en sous-mots fréquents",
              isCorrect: true,
            },
            { text: "Plus rapide à calculer", isCorrect: false },
            { text: "Produit moins de tokens", isCorrect: false },
            {
              text: "Meilleur pour les langues européennes uniquement",
              isCorrect: false,
            },
          ],
          explanation:
            "BPE décompose les mots rares en sous-séquences fréquentes, résolvant le problème OOV tout en gardant un vocabulaire fixe.",
        },
        {
          text: "En utilisant spaCy, quelle différence entre doc.ents et doc.noun_chunks ?",
          options: [
            {
              text: "ents contient les entités nommées, noun_chunks les syntagmes nominaux",
              isCorrect: true,
            },
            { text: "noun_chunks est plus précis", isCorrect: false },
            { text: "ents fonctionne seulement en anglais", isCorrect: false },
            { text: "Il n'y a pas de différence", isCorrect: false },
          ],
          explanation:
            "ents identifie des entités comme 'Apple Inc.' (ORG), 'Paris' (GPE), tandis que noun_chunks extrait des groupes nominaux comme 'the big red car'.",
        },
        {
          text: "Pourquoi TF-IDF pénalise-t-il les mots fréquents avec le terme IDF = log(N/df) ?",
          options: [
            {
              text: "Les mots très fréquents apportent moins d'information discriminante",
              isCorrect: true,
            },
            { text: "Pour réduire la taille du vocabulaire", isCorrect: false },
            { text: "Pour accélérer le calcul", isCorrect: false },
            {
              text: "Pour normaliser les longueurs de documents",
              isCorrect: false,
            },
          ],
          explanation:
            "Un mot présent dans tous les documents (df=N) a IDF=0, car il n'aide pas à distinguer les documents. Les mots rares ont plus de poids.",
        },
      ],

      "Infrastructure et DevOps pour ML": [
        {
          text: "Dans un Dockerfile pour ML, pourquoi COPY requirements.txt avant COPY . ?",
          options: [
            {
              text: "Optimiser le cache Docker : les dépendances changent moins souvent que le code",
              isCorrect: true,
            },
            {
              text: "Sécurité : éviter d'exposer le code source",
              isCorrect: false,
            },
            {
              text: "Performance : requirements.txt est plus petit",
              isCorrect: false,
            },
            { text: "Obligation syntaxique Docker", isCorrect: false },
          ],
          explanation:
            "Docker cache les layers. En copiant requirements.txt d'abord, pip install ne se réexécute que si les dépendances changent, pas à chaque modification de code.",
        },
        {
          text: "Selon la documentation Kubernetes, comment configurer les ressources pour un pod ML ?",
          options: [
            {
              text: "Spécifier requests (garantie) et limits (maximum) pour CPU/memory/GPU",
              isCorrect: true,
            },
            { text: "Utiliser seulement limits", isCorrect: false },
            {
              text: "Laisser Kubernetes décider automatiquement",
              isCorrect: false,
            },
            {
              text: "Configurer seulement au niveau du namespace",
              isCorrect: false,
            },
          ],
          explanation:
            "requests garantit les ressources au pod, limits empêche qu'il consomme trop. Essential pour les workloads ML gourmands en ressources.",
        },
        {
          text: "En MLOps, pourquoi monitorer la dérive des features et pas seulement l'accuracy ?",
          options: [
            {
              text: "La dérive des features précède souvent la dégradation de performance",
              isCorrect: true,
            },
            { text: "L'accuracy est toujours stable", isCorrect: false },
            { text: "Plus facile à calculer", isCorrect: false },
            { text: "Requis par la réglementation", isCorrect: false },
          ],
          explanation:
            "Les changements dans la distribution des features (data drift) causent souvent une baisse d'accuracy plus tard. La détection précoce permet une action proactive.",
        },
      ],

      "Analyse Exploratoire de Données": [
        {
          text: "Selon le livre 'Python for Data Analysis', comment identifier des outliers multivariés dans un DataFrame ?",
          options: [
            {
              text: "Isolation Forest, distance de Mahalanobis, ou PCA + distance euclidienne",
              isCorrect: true,
            },
            { text: "Seulement boxplot sur chaque variable", isCorrect: false },
            { text: "Correlation matrix uniquement", isCorrect: false },
            { text: "Z-score sur chaque colonne", isCorrect: false },
          ],
          explanation:
            "Les outliers multivariés ne sont pas détectables variable par variable. Il faut des méthodes comme Isolation Forest ou la distance de Mahalanobis qui considèrent les corrélations.",
        },
        {
          text: "En suivant 'Storytelling with Data', quel graphique pour montrer l'évolution de 5 métriques dans le temps ?",
          options: [
            {
              text: "Line chart avec axes secondaires ou small multiples, pas de pie chart",
              isCorrect: true,
            },
            { text: "Pie chart animé", isCorrect: false },
            { text: "Bar chart empilé", isCorrect: false },
            { text: "Scatter plot 3D", isCorrect: false },
          ],
          explanation:
            "Les line charts montrent clairement les tendances temporelles. Small multiples permettent de comparer facilement plusieurs métriques sans surcharge visuelle.",
        },
        {
          text: "Avec seaborn.heatmap() pour une matrice de corrélation, pourquoi utiliser annot=True et fmt='.2f' ?",
          options: [
            {
              text: "Afficher les valeurs numériques avec 2 décimales pour la lisibilité",
              isCorrect: true,
            },
            { text: "Améliorer les performances", isCorrect: false },
            { text: "Changer les couleurs", isCorrect: false },
            { text: "Réduire la taille du graphique", isCorrect: false },
          ],
          explanation:
            "annot=True affiche les valeurs de corrélation sur chaque cellule, fmt='.2f' limite à 2 décimales pour éviter l'encombrement visuel.",
        },
      ],
    };

    for (const goal of goals) {
      for (let i = 0; i < goal.modules.length; i++) {
        const module = goal.modules[i];
        const moduleTitle = module.title;

        // Utiliser les questions techniques spécifiques au module
        const questions = technicalQuizTemplates[moduleTitle] || [
          // Fallback avec questions techniques génériques adaptées aux ressources
          {
            text: `Selon les ressources étudiées dans "${moduleTitle}", quel est le concept technique le plus critique à maîtriser ?`,
            options: [
              {
                text: "La compréhension des fondements mathématiques et leur implémentation pratique",
                isCorrect: true,
              },
              {
                text: "La mémorisation des API sans comprendre",
                isCorrect: false,
              },
              { text: "L'utilisation d'outils sans théorie", isCorrect: false },
              {
                text: "L'application de recettes sans adaptation",
                isCorrect: false,
              },
            ],
            explanation: `Pour maîtriser ${moduleTitle}, il est essentiel de comprendre les principes sous-jacents pour pouvoir adapter les techniques aux problèmes spécifiques.`,
          },
          {
            text: `En pratiquant les ressources de "${moduleTitle}", comment débugger efficacement quand les résultats ne sont pas conformes aux attentes ?`,
            options: [
              {
                text: "Analyser étape par étape : données, preprocessing, modèle, métriques",
                isCorrect: true,
              },
              { text: "Changer d'algorithme immédiatement", isCorrect: false },
              { text: "Augmenter les données sans analyse", isCorrect: false },
              { text: "Copier une solution existante", isCorrect: false },
            ],
            explanation:
              "Un debugging systématique permet d'identifier la source du problème : qualité des données, bugs de preprocessing, architecture inappropriée, ou métriques mal choisies.",
          },
          {
            text: `Après avoir complété les ressources de "${moduleTitle}", comment valider votre maîtrise technique ?`,
            options: [
              {
                text: "Implémenter un projet from scratch et expliquer chaque choix technique",
                isCorrect: true,
              },
              { text: "Passer un quiz à choix multiples", isCorrect: false },
              { text: "Lire plus de documentation", isCorrect: false },
              { text: "Suivre d'autres cours similaires", isCorrect: false },
            ],
            explanation:
              "La capacité à implémenter une solution complète et justifier les choix techniques démontre une maîtrise approfondie au-delà de la mémorisation.",
          },
          {
            text: `Dans "${moduleTitle}", comment adapter les techniques apprises à un nouveau domaine d'application ?`,
            options: [
              {
                text: "Analyser les spécificités du domaine et adapter preprocessing/architecture en conséquence",
                isCorrect: true,
              },
              {
                text: "Appliquer exactement les mêmes hyperparamètres",
                isCorrect: false,
              },
              {
                text: "Utiliser les modèles pré-entraînés sans modification",
                isCorrect: false,
              },
              {
                text: "Ignorer les particularités du domaine",
                isCorrect: false,
              },
            ],
            explanation:
              "Chaque domaine a ses spécificités (types de données, contraintes, métriques). L'adaptation réfléchie des techniques est cruciale pour le succès.",
          },
          {
            text: `Comment intégrer les connaissances de "${moduleTitle}" dans un workflow de production ?`,
            options: [
              {
                text: "Pipeline robuste avec tests, monitoring, et documentation technique détaillée",
                isCorrect: true,
              },
              { text: "Script unique sans documentation", isCorrect: false },
              {
                text: "Modèle figé sans possibilité d'évolution",
                isCorrect: false,
              },
              {
                text: "Solution locale sans considération d'échelle",
                isCorrect: false,
              },
            ],
            explanation:
              "La production nécessite robustesse, reproductibilité, et maintenabilité. Tests automatisés, monitoring, et documentation sont essentiels.",
          },
        ];

        const quiz = new Quiz({
          moduleId: module._id.toString(),
          title: `Quiz Technique - ${moduleTitle}`,
          description: `Évaluation technique approfondie basée sur les ressources spécifiques de ${moduleTitle}`,
          timeLimit: 2400, // 40 minutes pour des questions plus complexes
          passingScore: 80, // Score plus élevé pour des questions techniques
          questions: questions,
        });

        await quiz.save();
        logger.info(`Technical quiz created for module: ${moduleTitle}`);
      }
    }
  } catch (error) {
    logger.error("Error creating technical quizzes:", error);
  }
}

async function createLearnerProfiles() {
  try {
    const users = await User.find({ role: "user" });
    const goals = await Goal.find();

    if (users.length === 0) {
      logger.warn("No users found, skipping learner profiles creation");
      return;
    }

    if (goals.length === 0) {
      logger.warn("No goals found, skipping learner profiles creation");
      return;
    }

    const learnerProfiles = [
      // Profil 1: Étudiant débutant
      {
        userId: users[0]._id,
        learningStyle: "visual",
        preferences: {
          mathLevel: "beginner",
          programmingLevel: "beginner",
          preferredDomain: "ml",
        },
        assessments: [
          {
            category: "math",
            score: 45,
            responses: [
              {
                questionId: "math_basic_1",
                selectedOption: "2x + 3",
                timeSpent: 45,
                category: "math",
                difficulty: "basic",
              },
              {
                questionId: "math_basic_2",
                selectedOption: "1/3", // Réponse incorrecte
                timeSpent: 60,
                category: "math",
                difficulty: "basic",
              },
            ],
            recommendations: [
              {
                category: "math",
                score: 45,
                recommendations: [
                  "Réviser les concepts de probabilités de base",
                  "Pratiquer le calcul différentiel avec Khan Academy",
                  "Suivre un cours de mise à niveau en mathématiques",
                ],
              },
            ],
            completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
        ],
        goal: goals[0]._id, // Machine Learning Engineer
      },

      // Profil 2: Ingénieur expérimenté
      {
        userId: users.length > 1 ? users[1]._id : users[0]._id,
        learningStyle: "reading",
        preferences: {
          mathLevel: "intermediate",
          programmingLevel: "advanced",
          preferredDomain: "dl",
        },
        assessments: [
          {
            category: "programming",
            score: 85,
            responses: [
              {
                questionId: "prog_adv_1",
                selectedOption:
                  "Les listes sont mutables, les tuples sont immutables",
                timeSpent: 20,
                category: "programming",
                difficulty: "basic",
              },
            ],
            recommendations: [
              {
                category: "programming",
                score: 85,
                recommendations: [
                  "Explorer les aspects avancés de l'architecture logicielle",
                  "Se concentrer sur l'optimisation de code pour ML",
                  "Approfondir les techniques de déploiement",
                ],
              },
            ],
            completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
        ],
        goal: goals.length > 1 ? goals[1]._id : goals[0]._id, // Deep Learning Specialist
      },

      // Profil 3: Data Analyst
      {
        userId: users.length > 2 ? users[2]._id : users[0]._id,
        learningStyle: "kinesthetic",
        preferences: {
          mathLevel: "advanced",
          programmingLevel: "intermediate",
          preferredDomain: "ml",
        },
        assessments: [
          {
            category: "math",
            score: 80,
            responses: [
              {
                questionId: "math_int_1",
                selectedOption:
                  "E[(X - μ)²] - la dispersion autour de la moyenne",
                timeSpent: 35,
                category: "math",
                difficulty: "intermediate",
              },
            ],
            recommendations: [
              {
                category: "math",
                score: 80,
                recommendations: [
                  "Approfondir les statistiques bayésiennes",
                  "Explorer l'analyse multivariée",
                  "Pratiquer avec des datasets réels complexes",
                ],
              },
            ],
            completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        ],
        goal: goals.length > 2 ? goals[2]._id : goals[0]._id, // Data Scientist
      },
    ];

    // Créer seulement les profils pour lesquels nous avons des utilisateurs
    const profilesToCreate = learnerProfiles.slice(
      0,
      Math.min(users.length, learnerProfiles.length)
    );

    for (const profileData of profilesToCreate) {
      const profile = new LearnerProfile(profileData);
      await profile.save();
      logger.info(`Learner profile created for user: ${profileData.userId}`);
    }
  } catch (error) {
    logger.error("Error creating learner profiles:", error);
  }
}

async function createPathways() {
  try {
    const users = await User.find({ role: "user" });
    const goals = await Goal.find();

    if (users.length === 0) {
      logger.warn("No users found, skipping pathways creation");
      return;
    }

    if (goals.length === 0) {
      logger.warn("No goals found, skipping pathways creation");
      return;
    }

    const pathways = [
      // Pathway 1: Débutant ML - Progress early stage
      {
        userId: users[0]._id,
        goalId: goals[0]._id, // ML Engineer
        status: "active",
        progress: 25,
        currentModule: 1,
        moduleProgress: [
          {
            moduleIndex: 0,
            completed: true,
            locked: false,
            resources: [
              {
                resourceId: "ml_course_andrew_ng",
                completed: true,
                completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              },
              {
                resourceId: "hands_on_ml_book",
                completed: true,
                completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              },
              {
                resourceId: "sklearn_guide",
                completed: false,
                completedAt: null,
              },
            ],
            quiz: {
              completed: true,
              score: 75,
              completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
          },
          {
            moduleIndex: 1,
            completed: false,
            locked: false,
            resources: [
              {
                resourceId: "python_data_handbook",
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
          {
            moduleIndex: 2,
            completed: false,
            locked: true,
            resources: [],
            quiz: {
              completed: false,
              score: 0,
              completedAt: null,
            },
          },
        ],
        startedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        lastAccessedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        estimatedCompletionDate: new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000
        ),
        adaptiveRecommendations: [
          {
            type: "practice",
            description:
              "Compléter le projet Kaggle House Prices pour consolider les acquis",
            priority: "high",
            status: "pending",
          },
          {
            type: "review",
            description: "Réviser les concepts de validation croisée",
            priority: "medium",
            status: "pending",
          },
        ],
        nextGoals: goals.length > 1 ? [goals[1]._id] : [], // Vers Deep Learning
      },

      // Pathway 2: Ingénieur expérimenté - Deep Learning avancé
      {
        userId: users.length > 1 ? users[1]._id : users[0]._id,
        goalId: goals.length > 1 ? goals[1]._id : goals[0]._id, // Deep Learning
        status: "active",
        progress: 60,
        currentModule: 2,
        moduleProgress: [
          {
            moduleIndex: 0,
            completed: true,
            locked: false,
            resources: [
              {
                resourceId: "deep_learning_book",
                completed: true,
                completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
              },
              {
                resourceId: "cs231n_course",
                completed: true,
                completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
              },
            ],
            quiz: {
              completed: true,
              score: 88,
              completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            },
          },
          {
            moduleIndex: 1,
            completed: true,
            locked: false,
            resources: [
              {
                resourceId: "cv_models_book",
                completed: true,
                completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
              },
            ],
            quiz: {
              completed: true,
              score: 82,
              completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
            },
          },
          {
            moduleIndex: 2,
            completed: false,
            locked: false,
            resources: [
              {
                resourceId: "cs224n_course",
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
        startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastAccessedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        estimatedCompletionDate: new Date(
          Date.now() + 45 * 24 * 60 * 60 * 1000
        ),
        adaptiveRecommendations: [
          {
            type: "practice",
            description: "Implémenter un transformer from scratch",
            priority: "high",
            status: "pending",
          },
          {
            type: "resource",
            description: "Lire les papers récents sur les Vision Transformers",
            priority: "medium",
            status: "pending",
          },
        ],
        nextGoals: goals.length > 3 ? [goals[3]._id, goals[4]._id] : [], // CV ou NLP specialization
      },

      // Pathway 3: Data Scientist - Focus analyse
      {
        userId: users.length > 2 ? users[2]._id : users[0]._id,
        goalId: goals.length > 2 ? goals[2]._id : goals[0]._id, // Data Scientist
        status: "active",
        progress: 40,
        currentModule: 0,
        moduleProgress: [
          {
            moduleIndex: 0,
            completed: false,
            locked: false,
            resources: [
              {
                resourceId: "python_data_analysis",
                completed: true,
                completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
              },
              {
                resourceId: "storytelling_data",
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
        startedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        lastAccessedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        estimatedCompletionDate: new Date(
          Date.now() + 60 * 24 * 60 * 60 * 1000
        ),
        adaptiveRecommendations: [
          {
            type: "practice",
            description: "Analyser un dataset complexe avec visualisations",
            priority: "high",
            status: "pending",
          },
        ],
        nextGoals: [goals[0]._id], // Vers ML Engineer
      },
    ];

    // Créer seulement les pathways pour lesquels nous avons des utilisateurs
    const pathwaysToCreate = pathways.slice(
      0,
      Math.min(users.length, pathways.length)
    );

    for (const pathwayData of pathwaysToCreate) {
      const pathway = new Pathway(pathwayData);
      await pathway.save();
      logger.info(`Pathway created for user: ${pathwayData.userId}`);
    }
  } catch (error) {
    logger.error("Error creating pathways:", error);
  }
}

async function populateDatabase() {
  try {
    await connectDB();
    await clearDatabase();

    logger.info("Starting enhanced database population...");

    await createUsers();
    await createConcepts();
    await createAssessments();
    await createGoals();
    await createQuizzes();
    await createLearnerProfiles();
    await createPathways();

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

    logger.info("\n=== 📊 DATABASE POPULATION COMPLETED ===");
    logger.info(`👥 Users: ${stats.users}`);
    logger.info(`🧠 Concepts: ${stats.concepts}`);
    logger.info(`🎯 Learning Goals: ${stats.goals}`);
    logger.info(`📊 Assessments: ${stats.assessments}`);
    logger.info(`📝 Quizzes: ${stats.quizzes}`);
    logger.info(`👤 Learner Profiles: ${stats.profiles}`);
    logger.info(`🛤️  Learning Pathways: ${stats.pathways}`);
    logger.info("\n✅ UCAD IA Learning Platform ready!");
  } catch (error) {
    logger.error("Error during database population:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Exécuter le script
populateDatabase();
