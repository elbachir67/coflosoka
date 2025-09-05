/**
 * Script pour créer des parcours progressifs structurés avec ressources enrichies
 */

import mongoose from "mongoose";
import { Goal } from "../models/LearningGoal.js";
import { Assessment } from "../models/Assessment.js";
import { Quiz } from "../models/Quiz.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("MongoDB Connected for progressive pathways creation");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Parcours progressifs structurés
const PROGRESSIVE_PATHWAYS = [
  {
    title: "Mathématiques pour l'Intelligence Artificielle",
    description:
      "Maîtrisez les fondements mathématiques essentiels pour comprendre et appliquer l'IA. Des vecteurs aux statistiques, avec des analogies concrètes et des exemples pratiques.",
    category: "math",
    level: "beginner",
    estimatedDuration: 12,
    prerequisites: [],
    modules: [
      {
        title: "Vecteurs et Espaces Vectoriels",
        description:
          "Comprenez les vecteurs comme direction + magnitude avec l'analogie du déplacement en ville",
        duration: 20,
        skills: [
          { name: "Vecteurs", level: "intermediate" },
          { name: "Opérations vectorielles", level: "intermediate" },
          { name: "Produit scalaire", level: "basic" },
        ],
        resources: [
          {
            title: "Les Vecteurs - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/math/vectors.html",
            type: "article",
            duration: 90,
          },
          {
            title: "Linear Algebra - Khan Academy",
            url: "https://www.khanacademy.org/math/linear-algebra",
            type: "course",
            duration: 180,
          },
          {
            title: "3Blue1Brown - Essence of Linear Algebra",
            url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
            type: "video",
            duration: 240,
          },
          {
            title: "Vector Operations Practice",
            url: "https://www.mathsisfun.com/algebra/vectors.html",
            type: "article",
            duration: 45,
          },
        ],
        validationCriteria: [
          "Maîtriser les opérations vectorielles de base",
          "Comprendre le produit scalaire et ses applications",
          "Calculer la norme et la distance entre vecteurs",
        ],
      },
      {
        title: "Matrices et Transformations Linéaires",
        description:
          "Matrices comme tableaux de transformations avec analogie GPS et coordonnées",
        duration: 25,
        skills: [
          { name: "Matrices", level: "intermediate" },
          { name: "Produit matriciel", level: "intermediate" },
          { name: "Déterminant et inverse", level: "basic" },
        ],
        resources: [
          {
            title: "Les Matrices - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/math/matrices.html",
            type: "article",
            duration: 120,
          },
          {
            title: "Matrix Algebra for Engineers",
            url: "https://www.coursera.org/learn/matrix-algebra-engineers",
            type: "course",
            duration: 300,
          },
          {
            title: "Matrix Multiplication Visualized",
            url: "https://www.youtube.com/watch?v=XkY2DOUCWMU",
            type: "video",
            duration: 60,
          },
          {
            title: "Interactive Matrix Calculator",
            url: "https://matrix.reshish.com/",
            type: "use_case",
            duration: 30,
          },
        ],
        validationCriteria: [
          "Effectuer des opérations matricielles complexes",
          "Comprendre les transformations linéaires",
          "Résoudre des systèmes d'équations linéaires",
        ],
      },
      {
        title: "Valeurs Propres et Décompositions",
        description:
          "Directions privilégiées avec analogie du ressort. Décomposition eigen et PCA",
        duration: 30,
        skills: [
          { name: "Valeurs propres", level: "advanced" },
          { name: "Diagonalisation", level: "intermediate" },
          { name: "PCA", level: "intermediate" },
        ],
        resources: [
          {
            title: "Valeurs Propres et Vecteurs Propres - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/math/eigenvalues.html",
            type: "article",
            duration: 150,
          },
          {
            title: "Eigenvalues and Eigenvectors - MIT",
            url: "https://ocw.mit.edu/courses/mathematics/18-06-linear-algebra-spring-2010/",
            type: "course",
            duration: 240,
          },
          {
            title: "Principal Component Analysis Explained",
            url: "https://www.youtube.com/watch?v=FgakZw6K1QQ",
            type: "video",
            duration: 90,
          },
        ],
        validationCriteria: [
          "Calculer valeurs propres et vecteurs propres",
          "Appliquer la décomposition eigen",
          "Comprendre et utiliser la PCA",
        ],
      },
      {
        title: "Calcul Différentiel et Optimisation",
        description:
          "Dérivées comme vitesse d'une voiture. Gradients et descente de gradient",
        duration: 25,
        skills: [
          { name: "Dérivées", level: "intermediate" },
          { name: "Gradients", level: "intermediate" },
          { name: "Optimisation", level: "basic" },
        ],
        resources: [
          {
            title: "Les Dérivées - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/math/derivatives.html",
            type: "article",
            duration: 100,
          },
          {
            title: "Les Gradients - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/math/gradients.html",
            type: "article",
            duration: 130,
          },
          {
            title: "Calculus - Khan Academy",
            url: "https://www.khanacademy.org/math/calculus-1",
            type: "course",
            duration: 200,
          },
          {
            title: "Gradient Descent Visualization",
            url: "https://www.youtube.com/watch?v=IHZwWFHWa-w",
            type: "video",
            duration: 75,
          },
        ],
        validationCriteria: [
          "Calculer des dérivées complexes",
          "Comprendre et appliquer la descente de gradient",
          "Optimiser des fonctions multivariables",
        ],
      },
      {
        title: "Probabilités et Statistiques",
        description:
          "Gestion de l'incertitude avec analogie météorologique. Théorème de Bayes et inférence",
        duration: 22,
        skills: [
          { name: "Probabilités", level: "intermediate" },
          { name: "Statistiques", level: "intermediate" },
          { name: "Inférence", level: "basic" },
        ],
        resources: [
          {
            title: "Les Probabilités - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/math/probability.html",
            type: "article",
            duration: 110,
          },
          {
            title: "Les Statistiques - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/math/statistics.html",
            type: "article",
            duration: 140,
          },
          {
            title: "Statistics and Probability - Khan Academy",
            url: "https://www.khanacademy.org/math/statistics-probability",
            type: "course",
            duration: 250,
          },
          {
            title: "Bayesian Thinking",
            url: "https://www.youtube.com/watch?v=HZGCoVF3YvM",
            type: "video",
            duration: 60,
          },
        ],
        validationCriteria: [
          "Appliquer le théorème de Bayes",
          "Analyser des distributions statistiques",
          "Distinguer corrélation et causalité",
        ],
      },
    ],
    careerOpportunities: [
      {
        title: "Data Analyst",
        description: "Analyste de données avec solides bases mathématiques",
        averageSalary: "35-50k€/an",
        companies: [
          "Banques",
          "Assurances",
          "Instituts de recherche",
          "Startups",
        ],
      },
    ],
    certification: {
      available: true,
      name: "Certificat Mathématiques pour l'IA",
      provider: "UCAD AI Center",
      url: "https://ucad.sn/certifications/math-ai",
    },
    recommendedFor: [
      {
        profile: "Débutant complet en mathématiques",
        reason: "Base solide nécessaire pour comprendre l'IA",
      },
      {
        profile: "Étudiant souhaitant approfondir les maths",
        reason: "Approche unique avec analogies concrètes",
      },
    ],
  },

  {
    title: "Programmation Python pour l'Intelligence Artificielle",
    description:
      "Maîtrisez l'écosystème Python pour l'IA, des bases aux bibliothèques spécialisées. Avec exemples sénégalais et projets concrets.",
    category: "programming",
    level: "beginner",
    estimatedDuration: 10,
    prerequisites: [
      {
        category: "math",
        skills: [{ name: "Algèbre de base", level: "basic" }],
      },
    ],
    modules: [
      {
        title: "Python Fondamentaux et Écosystème IA",
        description:
          "Pourquoi Python domine l'IA. Bases avec exemples sénégalais",
        duration: 18,
        skills: [
          { name: "Python syntaxe", level: "intermediate" },
          { name: "Structures de données", level: "intermediate" },
          { name: "Fonctions", level: "basic" },
        ],
        resources: [
          {
            title: "Python Bases - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/python/basics.html",
            type: "article",
            duration: 180,
          },
          {
            title: "Python for Everybody - Coursera",
            url: "https://www.coursera.org/specializations/python",
            type: "course",
            duration: 300,
          },
          {
            title: "Automate the Boring Stuff",
            url: "https://automatetheboringstuff.com/",
            type: "book",
            duration: 400,
          },
          {
            title: "Python Crash Course",
            url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
            type: "video",
            duration: 240,
          },
        ],
        validationCriteria: [
          "Maîtriser la syntaxe Python de base",
          "Utiliser listes, dictionnaires et fonctions",
          "Créer un programme complet",
        ],
      },
      {
        title: "NumPy - Calcul Numérique Révolutionnaire",
        description:
          "100x plus rapide que les listes. Arrays, broadcasting, algèbre linéaire",
        duration: 15,
        skills: [
          { name: "NumPy", level: "advanced" },
          { name: "Calcul vectoriel", level: "intermediate" },
          { name: "Broadcasting", level: "intermediate" },
        ],
        resources: [
          {
            title: "NumPy - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/python/numpy.html",
            type: "article",
            duration: 150,
          },
          {
            title: "NumPy Official Tutorial",
            url: "https://numpy.org/doc/stable/user/quickstart.html",
            type: "article",
            duration: 120,
          },
          {
            title: "NumPy for Data Science",
            url: "https://www.datacamp.com/courses/intro-to-python-for-data-science",
            type: "course",
            duration: 180,
          },
          {
            title: "NumPy Array Programming",
            url: "https://www.youtube.com/watch?v=QUT1VHiLmmI",
            type: "video",
            duration: 90,
          },
        ],
        validationCriteria: [
          "Maîtriser les arrays NumPy",
          "Utiliser le broadcasting efficacement",
          "Optimiser les calculs numériques",
        ],
      },
      {
        title: "Pandas - Manipulation de Données Avancée",
        description:
          "DataFrames intelligents. Nettoyage, analyse, préparation pour l'IA",
        duration: 20,
        skills: [
          { name: "Pandas", level: "advanced" },
          { name: "Data cleaning", level: "intermediate" },
          { name: "Data analysis", level: "intermediate" },
        ],
        resources: [
          {
            title: "Pandas - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/python/pandas.html",
            type: "article",
            duration: 160,
          },
          {
            title: "Pandas Documentation",
            url: "https://pandas.pydata.org/docs/user_guide/index.html",
            type: "article",
            duration: 200,
          },
          {
            title: "Data Analysis with Python",
            url: "https://www.freecodecamp.org/learn/data-analysis-with-python/",
            type: "course",
            duration: 300,
          },
          {
            title: "Pandas in 10 minutes",
            url: "https://www.youtube.com/watch?v=vmEHCJofslg",
            type: "video",
            duration: 60,
          },
        ],
        validationCriteria: [
          "Manipuler des DataFrames complexes",
          "Nettoyer des données réelles",
          "Préparer des données pour l'IA",
        ],
      },
      {
        title: "Visualisation et Algorithmes",
        description:
          "Matplotlib pour visualisation. Algorithmes efficaces pour l'IA",
        duration: 18,
        skills: [
          { name: "Matplotlib", level: "intermediate" },
          { name: "Algorithmes", level: "intermediate" },
          { name: "Complexité", level: "basic" },
        ],
        resources: [
          {
            title: "Matplotlib - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/python/matplotlib.html",
            type: "article",
            duration: 120,
          },
          {
            title: "Algorithmes - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/python/algorithms.html",
            type: "article",
            duration: 140,
          },
          {
            title: "Python Data Visualization",
            url: "https://www.datacamp.com/courses/introduction-to-data-visualization-with-matplotlib",
            type: "course",
            duration: 180,
          },
          {
            title: "Algorithms and Data Structures",
            url: "https://www.youtube.com/watch?v=8hly31xKli0",
            type: "video",
            duration: 300,
          },
        ],
        validationCriteria: [
          "Créer des visualisations professionnelles",
          "Implémenter des algorithmes efficaces",
          "Analyser la complexité algorithmique",
        ],
      },
    ],
    careerOpportunities: [
      {
        title: "Data Analyst",
        description:
          "Analyste de données avec solides bases mathématiques et Python",
        averageSalary: "35-55k€/an",
        companies: [
          "Banques",
          "Assurances",
          "Instituts de recherche",
          "Startups",
        ],
      },
    ],
    certification: {
      available: true,
      name: "Certificat Mathématiques et Python pour l'IA",
      provider: "UCAD AI Center",
      url: "https://ucad.sn/certifications/math-python-ai",
    },
  },

  {
    title: "Machine Learning - De la Théorie à la Pratique",
    description:
      "Maîtrisez les algorithmes d'apprentissage automatique avec une approche pratique. Des concepts fondamentaux aux applications réelles.",
    category: "ml",
    level: "intermediate",
    estimatedDuration: 14,
    prerequisites: [
      {
        category: "math",
        skills: [
          { name: "Statistiques", level: "basic" },
          { name: "Algèbre linéaire", level: "basic" },
        ],
      },
      {
        category: "programming",
        skills: [
          { name: "Python", level: "intermediate" },
          { name: "NumPy", level: "basic" },
          { name: "Pandas", level: "basic" },
        ],
      },
    ],
    modules: [
      {
        title: "Introduction au Machine Learning",
        description:
          "Qu'est-ce que le ML vraiment. Types d'apprentissage et métriques",
        duration: 20,
        skills: [
          { name: "Concepts ML", level: "intermediate" },
          { name: "Types d'apprentissage", level: "intermediate" },
          { name: "Métriques", level: "basic" },
        ],
        resources: [
          {
            title: "Introduction ML - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/ml/introduction.html",
            type: "article",
            duration: 120,
          },
          {
            title: "Machine Learning Course - Andrew Ng",
            url: "https://www.coursera.org/learn/machine-learning",
            type: "course",
            duration: 400,
          },
          {
            title: "Introduction to Statistical Learning",
            url: "https://www.statlearning.com/",
            type: "book",
            duration: 500,
          },
          {
            title: "ML Explained - 3Blue1Brown",
            url: "https://www.youtube.com/watch?v=aircAruvnKk",
            type: "video",
            duration: 90,
          },
        ],
        validationCriteria: [
          "Distinguer les types d'apprentissage",
          "Comprendre biais vs variance",
          "Évaluer un modèle correctement",
        ],
      },
      {
        title: "Régression et Prédiction",
        description:
          "Algorithmes de régression pour prédire des valeurs continues",
        duration: 25,
        skills: [
          { name: "Régression linéaire", level: "intermediate" },
          { name: "Régression polynomiale", level: "basic" },
          { name: "Régularisation", level: "basic" },
        ],
        resources: [
          {
            title: "Régression Linéaire - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/ml/linear-regression.html",
            type: "article",
            duration: 90,
          },
          {
            title: "Linear Regression - Scikit-learn",
            url: "https://scikit-learn.org/stable/modules/linear_model.html",
            type: "article",
            duration: 120,
          },
          {
            title: "Regression Analysis Course",
            url: "https://www.edx.org/course/introduction-to-linear-models-and-matrix-algebra",
            type: "course",
            duration: 200,
          },
          {
            title: "House Prices Prediction - Kaggle",
            url: "https://www.kaggle.com/c/house-prices-advanced-regression-techniques",
            type: "use_case",
            duration: 180,
          },
        ],
        validationCriteria: [
          "Implémenter une régression linéaire",
          "Comprendre les métriques de régression",
          "Gérer l'overfitting avec la régularisation",
        ],
      },
      {
        title: "Classification et Reconnaissance",
        description:
          "Algorithmes de classification pour catégoriser et reconnaître",
        duration: 25,
        skills: [
          { name: "Classification", level: "intermediate" },
          { name: "Arbres de décision", level: "intermediate" },
          { name: "SVM", level: "basic" },
        ],
        resources: [
          {
            title: "Classification - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/ml/classification.html",
            type: "article",
            duration: 100,
          },
          {
            title: "Classification Algorithms - Scikit-learn",
            url: "https://scikit-learn.org/stable/supervised_learning.html",
            type: "article",
            duration: 150,
          },
          {
            title: "Titanic Survival Prediction",
            url: "https://www.kaggle.com/c/titanic",
            type: "use_case",
            duration: 120,
          },
          {
            title: "Decision Trees Explained",
            url: "https://www.youtube.com/watch?v=7VeUPuFGJHk",
            type: "video",
            duration: 75,
          },
        ],
        validationCriteria: [
          "Implémenter différents classificateurs",
          "Évaluer avec précision, rappel, F1-score",
          "Choisir l'algorithme approprié",
        ],
      },
      {
        title: "Clustering et Apprentissage Non-Supervisé",
        description: "Découvrir des patterns cachés dans les données",
        duration: 20,
        skills: [
          { name: "K-means", level: "intermediate" },
          { name: "Clustering hiérarchique", level: "basic" },
          { name: "Évaluation clustering", level: "basic" },
        ],
        resources: [
          {
            title: "Clustering - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/ml/clustering.html",
            type: "article",
            duration: 90,
          },
          {
            title: "Unsupervised Learning - Scikit-learn",
            url: "https://scikit-learn.org/stable/unsupervised_learning.html",
            type: "article",
            duration: 120,
          },
          {
            title: "Customer Segmentation Project",
            url: "https://www.kaggle.com/datasets/vjchoudhary7/customer-segmentation-tutorial-in-python",
            type: "use_case",
            duration: 150,
          },
        ],
        validationCriteria: [
          "Implémenter K-means from scratch",
          "Évaluer la qualité du clustering",
          "Appliquer à un cas réel",
        ],
      },
      {
        title: "Validation et Optimisation de Modèles",
        description:
          "Techniques avancées pour évaluer et optimiser les performances",
        duration: 22,
        skills: [
          { name: "Validation croisée", level: "intermediate" },
          { name: "Hyperparameter tuning", level: "intermediate" },
          { name: "Feature engineering", level: "basic" },
        ],
        resources: [
          {
            title: "Validation - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/ml/validation.html",
            type: "article",
            duration: 110,
          },
          {
            title: "Model Selection - Scikit-learn",
            url: "https://scikit-learn.org/stable/model_selection.html",
            type: "article",
            duration: 140,
          },
          {
            title: "Feature Engineering Course",
            url: "https://www.kaggle.com/learn/feature-engineering",
            type: "course",
            duration: 180,
          },
        ],
        validationCriteria: [
          "Appliquer la validation croisée",
          "Optimiser les hyperparamètres",
          "Éviter l'overfitting",
        ],
      },
    ],
    careerOpportunities: [
      {
        title: "Data Scientist",
        description: "Analyste de données avec expertise ML",
        averageSalary: "50-75k€/an",
        companies: ["Orange", "Sonatel", "Fintech", "Startups IA"],
      },
      {
        title: "ML Engineer",
        description: "Développeur spécialisé en modèles ML",
        averageSalary: "55-80k€/an",
        companies: ["Tech companies", "Banques", "Assurances"],
      },
    ],
    certification: {
      available: true,
      name: "Certificat Machine Learning Practitioner",
      provider: "UCAD AI Center",
      url: "https://ucad.sn/certifications/ml-practitioner",
    },
  },

  {
    title: "Deep Learning - Réseaux de Neurones Modernes",
    description:
      "Plongez dans les architectures de réseaux de neurones profonds. Du perceptron aux architectures modernes.",
    category: "dl",
    level: "advanced",
    estimatedDuration: 16,
    prerequisites: [
      {
        category: "math",
        skills: [
          { name: "Calcul différentiel", level: "intermediate" },
          { name: "Algèbre linéaire", level: "intermediate" },
        ],
      },
      {
        category: "programming",
        skills: [
          { name: "Python", level: "advanced" },
          { name: "NumPy", level: "intermediate" },
        ],
      },
    ],
    modules: [
      {
        title: "Perceptron et Neurone Artificiel",
        description:
          "Fondement des réseaux de neurones. Du neurone biologique au perceptron",
        duration: 20,
        skills: [
          { name: "Perceptron", level: "intermediate" },
          { name: "Fonctions d'activation", level: "basic" },
          { name: "Apprentissage supervisé", level: "intermediate" },
        ],
        resources: [
          {
            title: "Perceptron - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/dl/perceptron.html",
            type: "article",
            duration: 90,
          },
          {
            title: "Neural Networks and Deep Learning",
            url: "https://www.coursera.org/learn/neural-networks-deep-learning",
            type: "course",
            duration: 250,
          },
          {
            title: "But what is a Neural Network?",
            url: "https://www.youtube.com/watch?v=aircAruvnKk",
            type: "video",
            duration: 75,
          },
          {
            title: "Perceptron Implementation",
            url: "https://machinelearningmastery.com/implement-perceptron-algorithm-scratch-python/",
            type: "article",
            duration: 60,
          },
        ],
        validationCriteria: [
          "Comprendre le fonctionnement d'un neurone",
          "Implémenter un perceptron simple",
          "Choisir les bonnes fonctions d'activation",
        ],
      },
      {
        title: "Réseaux de Neurones Multicouches",
        description:
          "Architecture des réseaux profonds. Couches cachées et apprentissage",
        duration: 25,
        skills: [
          { name: "Réseaux multicouches", level: "advanced" },
          { name: "Initialisation", level: "intermediate" },
          { name: "Régularisation", level: "intermediate" },
        ],
        resources: [
          {
            title: "Réseaux de Neurones - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/dl/neural-networks.html",
            type: "article",
            duration: 120,
          },
          {
            title: "Deep Learning Specialization",
            url: "https://www.coursera.org/specializations/deep-learning",
            type: "course",
            duration: 400,
          },
          {
            title: "Neural Networks from Scratch",
            url: "https://www.youtube.com/playlist?list=PLQVvvaa0QuDcjD5BAw2DxE6OF2tius3V3",
            type: "video",
            duration: 300,
          },
        ],
        validationCriteria: [
          "Construire un réseau multicouche",
          "Appliquer la régularisation",
          "Optimiser l'architecture",
        ],
      },
      {
        title: "Rétropropagation et Optimisation",
        description: "Algorithme de rétropropagation. Optimiseurs modernes",
        duration: 25,
        skills: [
          { name: "Backpropagation", level: "advanced" },
          { name: "Optimiseurs", level: "intermediate" },
          { name: "Learning rate", level: "intermediate" },
        ],
        resources: [
          {
            title: "Backpropagation - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/dl/backpropagation.html",
            type: "article",
            duration: 130,
          },
          {
            title: "Backpropagation Calculus",
            url: "https://www.youtube.com/watch?v=Ilg3gGewQ5U",
            type: "video",
            duration: 90,
          },
          {
            title: "Optimization for Deep Learning",
            url: "https://d2l.ai/chapter_optimization/",
            type: "article",
            duration: 180,
          },
        ],
        validationCriteria: [
          "Comprendre la rétropropagation",
          "Implémenter différents optimiseurs",
          "Diagnostiquer les problèmes d'entraînement",
        ],
      },
      {
        title: "CNN - Vision par Ordinateur",
        description: "Réseaux convolutifs pour traiter les images",
        duration: 30,
        skills: [
          { name: "CNN", level: "advanced" },
          { name: "Convolution", level: "intermediate" },
          { name: "Transfer learning", level: "intermediate" },
        ],
        resources: [
          {
            title: "CNN - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/dl/cnn.html",
            type: "article",
            duration: 140,
          },
          {
            title: "CS231n - Stanford CNN Course",
            url: "http://cs231n.stanford.edu/",
            type: "course",
            duration: 500,
          },
          {
            title: "CNN Architectures",
            url: "https://www.youtube.com/watch?v=ArPaAX_PhIs",
            type: "video",
            duration: 120,
          },
          {
            title: "Image Classification with CNN",
            url: "https://www.tensorflow.org/tutorials/images/cnn",
            type: "use_case",
            duration: 90,
          },
        ],
        validationCriteria: [
          "Construire un CNN from scratch",
          "Appliquer le transfer learning",
          "Optimiser pour la vision",
        ],
      },
      {
        title: "RNN et Données Séquentielles",
        description:
          "Réseaux récurrents pour traiter les séquences temporelles",
        duration: 28,
        skills: [
          { name: "RNN", level: "advanced" },
          { name: "LSTM", level: "intermediate" },
          { name: "Séquences", level: "intermediate" },
        ],
        resources: [
          {
            title: "RNN/LSTM - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/dl/rnn.html",
            type: "article",
            duration: 120,
          },
          {
            title: "Understanding LSTM Networks",
            url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/",
            type: "article",
            duration: 90,
          },
          {
            title: "RNN Course - deeplearning.ai",
            url: "https://www.coursera.org/learn/nlp-sequence-models",
            type: "course",
            duration: 300,
          },
          {
            title: "Time Series Forecasting",
            url: "https://www.tensorflow.org/tutorials/structured_data/time_series",
            type: "use_case",
            duration: 120,
          },
        ],
        validationCriteria: [
          "Comprendre les RNN et leurs limitations",
          "Implémenter un LSTM",
          "Traiter des données séquentielles",
        ],
      },
    ],
    careerOpportunities: [
      {
        title: "Deep Learning Engineer",
        description: "Spécialiste en développement de modèles de deep learning",
        averageSalary: "70-120k€/an",
        companies: ["Google", "Meta", "Microsoft", "Startups IA"],
      },
      {
        title: "Computer Vision Engineer",
        description: "Expert en traitement d'images et vidéos",
        averageSalary: "65-100k€/an",
        companies: ["Tesla", "Uber", "Startups Automotive"],
      },
    ],
    certification: {
      available: true,
      name: "Certificat Deep Learning Expert",
      provider: "UCAD AI Research Lab",
      url: "https://ucad.sn/certifications/deep-learning-expert",
    },
  },

  {
    title: "LLMs et IA Générative Moderne",
    description:
      "Maîtrisez les modèles de langage et l'IA générative. De l'attention aux applications pratiques.",
    category: "nlp",
    level: "advanced",
    estimatedDuration: 18,
    prerequisites: [
      {
        category: "programming",
        skills: [
          { name: "Python", level: "advanced" },
          { name: "Deep Learning", level: "intermediate" },
        ],
      },
      {
        category: "theory",
        skills: [
          { name: "Réseaux de neurones", level: "intermediate" },
          { name: "Probabilités", level: "intermediate" },
        ],
      },
    ],
    modules: [
      {
        title: "Mécanisme d'Attention",
        description:
          "Révolution de l'attention en NLP. Self-attention et multi-head",
        duration: 25,
        skills: [
          { name: "Attention mechanism", level: "advanced" },
          { name: "Self-attention", level: "intermediate" },
          { name: "Multi-head attention", level: "intermediate" },
        ],
        resources: [
          {
            title: "Attention - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/llm/attention.html",
            type: "article",
            duration: 120,
          },
          {
            title: "Attention Is All You Need - Paper",
            url: "https://arxiv.org/abs/1706.03762",
            type: "article",
            duration: 180,
          },
          {
            title: "Attention Mechanism Explained",
            url: "https://www.youtube.com/watch?v=iDulhoQ2pro",
            type: "video",
            duration: 90,
          },
          {
            title: "Attention Visualization",
            url: "https://github.com/jessevig/bertviz",
            type: "use_case",
            duration: 60,
          },
        ],
        validationCriteria: [
          "Comprendre le mécanisme d'attention",
          "Implémenter self-attention",
          "Visualiser les patterns d'attention",
        ],
      },
      {
        title: "Architecture Transformers",
        description:
          "Architecture révolutionnaire des Transformers. Encoder-decoder",
        duration: 30,
        skills: [
          { name: "Transformers", level: "advanced" },
          { name: "Positional encoding", level: "intermediate" },
          { name: "Layer normalization", level: "basic" },
        ],
        resources: [
          {
            title: "Transformers - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/llm/transformers.html",
            type: "article",
            duration: 150,
          },
          {
            title: "The Illustrated Transformer",
            url: "https://jalammar.github.io/illustrated-transformer/",
            type: "article",
            duration: 120,
          },
          {
            title: "Transformers from Scratch",
            url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
            type: "video",
            duration: 180,
          },
          {
            title: "Hugging Face Transformers",
            url: "https://huggingface.co/course/chapter1/1",
            type: "course",
            duration: 300,
          },
        ],
        validationCriteria: [
          "Comprendre l'architecture Transformer",
          "Implémenter un Transformer simple",
          "Utiliser des modèles pré-entraînés",
        ],
      },
      {
        title: "GPT et BERT - Modèles de Langage",
        description:
          "Modèles de langage révolutionnaires. Génération vs compréhension",
        duration: 28,
        skills: [
          { name: "GPT", level: "advanced" },
          { name: "BERT", level: "advanced" },
          { name: "Modèles de langage", level: "intermediate" },
        ],
        resources: [
          {
            title: "GPT & BERT - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/llm/gpt-bert.html",
            type: "article",
            duration: 140,
          },
          {
            title: "BERT Paper Explained",
            url: "https://arxiv.org/abs/1810.04805",
            type: "article",
            duration: 120,
          },
          {
            title: "GPT-3 and Beyond",
            url: "https://www.youtube.com/watch?v=SY5PvZrJhLE",
            type: "video",
            duration: 90,
          },
          {
            title: "Fine-tuning BERT",
            url: "https://huggingface.co/transformers/training.html",
            type: "use_case",
            duration: 150,
          },
        ],
        validationCriteria: [
          "Comprendre GPT vs BERT",
          "Fine-tuner un modèle BERT",
          "Générer du texte avec GPT",
        ],
      },
      {
        title: "Fine-tuning et Adaptation",
        description:
          "Adapter les modèles pré-entraînés à vos tâches spécifiques",
        duration: 25,
        skills: [
          { name: "Fine-tuning", level: "advanced" },
          { name: "Transfer learning", level: "intermediate" },
          { name: "Domain adaptation", level: "intermediate" },
        ],
        resources: [
          {
            title: "Fine-tuning - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/llm/fine-tuning.html",
            type: "article",
            duration: 120,
          },
          {
            title: "Fine-tuning Large Language Models",
            url: "https://www.deeplearning.ai/short-courses/finetuning-large-language-models/",
            type: "course",
            duration: 200,
          },
          {
            title: "Parameter Efficient Fine-tuning",
            url: "https://arxiv.org/abs/2106.09685",
            type: "article",
            duration: 90,
          },
        ],
        validationCriteria: [
          "Fine-tuner un modèle pour une tâche spécifique",
          "Optimiser les ressources de fine-tuning",
          "Évaluer les performances post fine-tuning",
        ],
      },
      {
        title: "Prompt Engineering et Applications",
        description:
          "Art de communiquer avec l'IA. Techniques de prompting efficace",
        duration: 22,
        skills: [
          { name: "Prompt engineering", level: "advanced" },
          { name: "Few-shot learning", level: "intermediate" },
          { name: "Chain of thought", level: "intermediate" },
        ],
        resources: [
          {
            title: "Prompt Engineering - AI4Ndada",
            url: "http://ai4ndada01.surge.sh/modules/llm/prompt-engineering.html",
            type: "article",
            duration: 110,
          },
          {
            title: "Prompt Engineering Guide",
            url: "https://www.promptingguide.ai/",
            type: "article",
            duration: 150,
          },
          {
            title: "ChatGPT Prompt Engineering",
            url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",
            type: "course",
            duration: 180,
          },
          {
            title: "Advanced Prompting Techniques",
            url: "https://www.youtube.com/watch?v=dOxUroR57xs",
            type: "video",
            duration: 75,
          },
        ],
        validationCriteria: [
          "Créer des prompts efficaces",
          "Utiliser few-shot learning",
          "Appliquer chain of thought reasoning",
        ],
      },
    ],
    careerOpportunities: [
      {
        title: "LLM Engineer",
        description: "Spécialiste en modèles de langage et IA générative",
        averageSalary: "80-150k€/an",
        companies: ["OpenAI", "Anthropic", "Google", "Startups IA"],
      },
      {
        title: "Prompt Engineer",
        description: "Expert en communication avec les systèmes d'IA",
        averageSalary: "60-100k€/an",
        companies: ["Entreprises utilisant l'IA", "Consultants", "Startups"],
      },
    ],
    certification: {
      available: true,
      name: "Certificat LLM et IA Générative",
      provider: "UCAD AI Research Lab",
      url: "https://ucad.sn/certifications/llm-generative-ai",
    },
  },

  {
    title: "Computer Vision - Applications Pratiques",
    description:
      "Développez des applications de vision par ordinateur pour résoudre des problèmes réels. De la théorie aux applications industrielles.",
    category: "computer_vision",
    level: "intermediate",
    estimatedDuration: 14,
    prerequisites: [
      {
        category: "programming",
        skills: [
          { name: "Python", level: "intermediate" },
          { name: "NumPy", level: "intermediate" },
        ],
      },
      {
        category: "theory",
        skills: [
          { name: "Deep Learning", level: "basic" },
          { name: "CNN", level: "basic" },
        ],
      },
    ],
    modules: [
      {
        title: "Traitement d'Images Fondamental",
        description: "Bases du traitement d'images numériques avec OpenCV",
        duration: 22,
        skills: [
          { name: "Traitement d'images", level: "intermediate" },
          { name: "OpenCV", level: "intermediate" },
          { name: "Filtres", level: "basic" },
        ],
        resources: [
          {
            title: "Computer Vision Course - Udacity",
            url: "https://www.udacity.com/course/computer-vision-nanodegree--nd891",
            type: "course",
            duration: 200,
          },
          {
            title: "OpenCV Python Tutorial",
            url: "https://opencv-python-tutroals.readthedocs.io/",
            type: "article",
            duration: 150,
          },
          {
            title: "Image Processing with Python",
            url: "https://www.youtube.com/playlist?list=PLQVvvaa0QuDdttJXlLtAJxJetJcqmqlQq",
            type: "video",
            duration: 180,
          },
          {
            title: "OpenCV Exercises",
            url: "https://github.com/spmallick/learnopencv",
            type: "use_case",
            duration: 120,
          },
        ],
        validationCriteria: [
          "Manipuler des images avec OpenCV",
          "Appliquer des filtres et transformations",
          "Détecter des contours et formes",
        ],
      },
      {
        title: "Détection et Reconnaissance d'Objets",
        description: "Systèmes de détection d'objets modernes (YOLO, R-CNN)",
        duration: 30,
        skills: [
          { name: "Détection d'objets", level: "advanced" },
          { name: "YOLO", level: "intermediate" },
          { name: "R-CNN", level: "intermediate" },
        ],
        resources: [
          {
            title: "Object Detection with YOLO",
            url: "https://pjreddie.com/darknet/yolo/",
            type: "article",
            duration: 90,
          },
          {
            title: "Computer Vision - Kaggle Learn",
            url: "https://www.kaggle.com/learn/computer-vision",
            type: "course",
            duration: 180,
          },
          {
            title: "YOLO Object Detection",
            url: "https://www.youtube.com/watch?v=ag3DLKsl2vk",
            type: "video",
            duration: 120,
          },
          {
            title: "Object Detection Project",
            url: "https://github.com/ultralytics/yolov5",
            type: "use_case",
            duration: 200,
          },
        ],
        validationCriteria: [
          "Entraîner un modèle YOLO",
          "Évaluer les performances de détection",
          "Déployer un système de détection",
        ],
      },
    ],
    careerOpportunities: [
      {
        title: "Computer Vision Engineer",
        description: "Développeur spécialisé en vision par ordinateur",
        averageSalary: "60-95k€/an",
        companies: ["Tesla", "Uber", "Startups Automotive", "Sécurité"],
      },
    ],
    certification: {
      available: true,
      name: "Certificat Computer Vision Specialist",
      provider: "UCAD Engineering",
      url: "https://ucad.sn/certifications/computer-vision",
    },
  },

  {
    title: "MLOps et Déploiement en Production",
    description:
      "Apprenez à déployer et maintenir des modèles ML en production. De l'expérimentation au déploiement à grande échelle.",
    category: "mlops",
    level: "advanced",
    estimatedDuration: 12,
    prerequisites: [
      {
        category: "programming",
        skills: [
          { name: "Python", level: "advanced" },
          { name: "Git", level: "intermediate" },
        ],
      },
      {
        category: "theory",
        skills: [{ name: "Machine Learning", level: "intermediate" }],
      },
    ],
    modules: [
      {
        title: "Pipeline ML et Versioning",
        description: "Construisez des pipelines ML robustes et reproductibles",
        duration: 25,
        skills: [
          { name: "MLflow", level: "intermediate" },
          { name: "DVC", level: "intermediate" },
          { name: "Pipeline automation", level: "advanced" },
        ],
        resources: [
          {
            title: "MLOps Specialization",
            url: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops",
            type: "course",
            duration: 300,
          },
          {
            title: "MLflow Documentation",
            url: "https://mlflow.org/docs/latest/index.html",
            type: "article",
            duration: 120,
          },
          {
            title: "MLOps Explained",
            url: "https://www.youtube.com/watch?v=ZVWg18AXXuE",
            type: "video",
            duration: 90,
          },
        ],
        validationCriteria: [
          "Créer un pipeline ML complet",
          "Versionner modèles et données",
          "Automatiser l'entraînement",
        ],
      },
      {
        title: "Déploiement et Monitoring",
        description:
          "Déployez des modèles en production et surveillez leurs performances",
        duration: 28,
        skills: [
          { name: "Docker", level: "intermediate" },
          { name: "Kubernetes", level: "basic" },
          { name: "Model serving", level: "advanced" },
        ],
        resources: [
          {
            title: "Model Deployment Best Practices",
            url: "https://neptune.ai/blog/model-deployment-best-practices",
            type: "article",
            duration: 90,
          },
          {
            title: "Docker for Data Science",
            url: "https://www.datacamp.com/courses/introduction-to-docker",
            type: "course",
            duration: 150,
          },
          {
            title: "ML Model Deployment",
            url: "https://www.youtube.com/watch?v=mrExsjcvF4o",
            type: "video",
            duration: 120,
          },
        ],
        validationCriteria: [
          "Déployer un modèle avec Docker",
          "Mettre en place du monitoring",
          "Gérer les mises à jour de modèles",
        ],
      },
    ],
    careerOpportunities: [
      {
        title: "MLOps Engineer",
        description: "Spécialiste en infrastructure et déploiement ML",
        averageSalary: "75-130k€/an",
        companies: ["Netflix", "Spotify", "Uber", "Airbnb"],
      },
    ],
    certification: {
      available: true,
      name: "Certificat MLOps Professional",
      provider: "UCAD DevOps Center",
      url: "https://ucad.sn/certifications/mlops-professional",
    },
  },
];

// Questions d'évaluation enrichies pour le profilage
const ENRICHED_ASSESSMENT_QUESTIONS = {
  math_basic: [
    {
      text: "Qu'est-ce qu'un vecteur ?",
      options: [
        { text: "Une quantité ayant direction et magnitude", isCorrect: true },
        { text: "Un nombre simple", isCorrect: false },
        { text: "Une liste de nombres", isCorrect: false },
        { text: "Une fonction mathématique", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "Un vecteur combine direction et magnitude, comme un déplacement en ville.",
    },
    {
      text: "Comment additionne-t-on deux vecteurs ?",
      options: [
        {
          text: "En additionnant leurs composantes correspondantes",
          isCorrect: true,
        },
        { text: "En multipliant leurs composantes", isCorrect: false },
        { text: "En prenant la moyenne", isCorrect: false },
        { text: "En calculant leur produit scalaire", isCorrect: false },
      ],
      difficulty: "basic",
      explanation: "L'addition vectorielle se fait composante par composante.",
    },
    {
      text: "Qu'est-ce qu'une matrice ?",
      options: [
        { text: "Un tableau rectangulaire de nombres", isCorrect: true },
        { text: "Un seul nombre", isCorrect: false },
        { text: "Une liste de vecteurs", isCorrect: false },
        { text: "Une fonction", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "Une matrice est un arrangement rectangulaire de nombres en lignes et colonnes.",
    },
  ],

  math_intermediate: [
    {
      text: "Quelle est la dérivée de f(x) = x² + 3x + 2 ?",
      options: [
        { text: "2x + 3", isCorrect: true },
        { text: "x² + 3", isCorrect: false },
        { text: "2x + 2", isCorrect: false },
        { text: "x + 3", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "La dérivée de x² est 2x, de 3x est 3, et d'une constante est 0.",
    },
    {
      text: "Qu'est-ce que le gradient d'une fonction ?",
      options: [
        { text: "Le vecteur des dérivées partielles", isCorrect: true },
        { text: "La dérivée simple", isCorrect: false },
        { text: "La pente maximale", isCorrect: false },
        { text: "L'intégrale de la fonction", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Le gradient indique la direction de plus forte croissance, comme un alpiniste.",
    },
  ],

  python_basic: [
    {
      text: "Comment créer une liste en Python ?",
      options: [
        { text: "ma_liste = [1, 2, 3]", isCorrect: true },
        { text: "ma_liste = (1, 2, 3)", isCorrect: false },
        { text: "ma_liste = {1, 2, 3}", isCorrect: false },
        { text: "ma_liste = 1, 2, 3", isCorrect: false },
      ],
      difficulty: "basic",
      explanation: "Les crochets [] définissent une liste en Python.",
    },
    {
      text: "Que fait cette ligne : for i in range(5) ?",
      options: [
        { text: "Boucle de 0 à 4", isCorrect: true },
        { text: "Boucle de 1 à 5", isCorrect: false },
        { text: "Boucle de 0 à 5", isCorrect: false },
        { text: "Boucle infinie", isCorrect: false },
      ],
      difficulty: "basic",
      explanation: "range(5) génère les nombres de 0 à 4 (5 exclus).",
    },
  ],

  python_intermediate: [
    {
      text: "Qu'est-ce que NumPy apporte par rapport aux listes Python ?",
      options: [
        {
          text: "Performance 100x supérieure et opérations vectorielles",
          isCorrect: true,
        },
        { text: "Juste une syntaxe différente", isCorrect: false },
        { text: "Plus de types de données", isCorrect: false },
        { text: "Meilleure lisibilité", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "NumPy révolutionne le calcul avec des performances exceptionnelles.",
    },
    {
      text: "Que fait le broadcasting en NumPy ?",
      options: [
        {
          text: "Permet des opérations sur arrays de tailles différentes",
          isCorrect: true,
        },
        { text: "Diffuse des données sur le réseau", isCorrect: false },
        { text: "Copie des arrays", isCorrect: false },
        { text: "Trie des données", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Le broadcasting étend automatiquement les dimensions pour les opérations.",
    },
  ],

  ml_basic: [
    {
      text: "Qu'est-ce que l'apprentissage supervisé ?",
      options: [
        { text: "Apprentissage avec des exemples étiquetés", isCorrect: true },
        { text: "Apprentissage sans données", isCorrect: false },
        { text: "Apprentissage par essai-erreur", isCorrect: false },
        { text: "Apprentissage automatique", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "L'apprentissage supervisé utilise des données avec les bonnes réponses.",
    },
  ],

  dl_basic: [
    {
      text: "Qu'est-ce qu'un perceptron ?",
      options: [
        { text: "Un neurone artificiel simple", isCorrect: true },
        { text: "Un algorithme de tri", isCorrect: false },
        { text: "Une base de données", isCorrect: false },
        { text: "Un langage de programmation", isCorrect: false },
      ],
      difficulty: "basic",
      explanation: "Le perceptron est l'unité de base des réseaux de neurones.",
    },
  ],

  llm_basic: [
    {
      text: "Qu'est-ce qu'un modèle de langage ?",
      options: [
        {
          text: "Un modèle qui prédit la probabilité des mots",
          isCorrect: true,
        },
        { text: "Un traducteur automatique", isCorrect: false },
        { text: "Un correcteur orthographique", isCorrect: false },
        { text: "Un dictionnaire", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "Un modèle de langage estime la probabilité des séquences de mots.",
    },
  ],
};

async function createProgressivePathways() {
  try {
    await connectDB();

    logger.info("Creating progressive structured pathways...");

    // Supprimer les anciens objectifs pour recommencer proprement
    await Goal.deleteMany({});
    logger.info("Cleared existing goals");

    // Créer les nouveaux parcours progressifs
    for (const pathwayData of PROGRESSIVE_PATHWAYS) {
      const goal = new Goal(pathwayData);
      await goal.save();
      logger.info(`Created pathway: ${pathwayData.title}`);

      // Créer des quiz pour chaque module
      for (let i = 0; i < goal.modules.length; i++) {
        const module = goal.modules[i];

        // Sélectionner des questions appropriées selon la catégorie
        let questionPool = [];

        switch (goal.category) {
          case "math":
            questionPool = [
              ...ENRICHED_ASSESSMENT_QUESTIONS.math_basic,
              ...ENRICHED_ASSESSMENT_QUESTIONS.math_intermediate,
            ];
            break;
          case "programming":
            questionPool = [
              ...ENRICHED_ASSESSMENT_QUESTIONS.python_basic,
              ...ENRICHED_ASSESSMENT_QUESTIONS.python_intermediate,
            ];
            break;
          case "ml":
            questionPool = [
              ...ENRICHED_ASSESSMENT_QUESTIONS.ml_basic,
              ...ENRICHED_ASSESSMENT_QUESTIONS.math_intermediate,
            ];
            break;
          case "dl":
            questionPool = [
              ...ENRICHED_ASSESSMENT_QUESTIONS.dl_basic,
              ...ENRICHED_ASSESSMENT_QUESTIONS.math_intermediate,
            ];
            break;
          case "nlp":
            questionPool = [
              ...ENRICHED_ASSESSMENT_QUESTIONS.llm_basic,
              ...ENRICHED_ASSESSMENT_QUESTIONS.python_intermediate,
            ];
            break;
          default:
            questionPool = ENRICHED_ASSESSMENT_QUESTIONS.math_basic;
        }

        // Mélanger et sélectionner 8-12 questions
        const shuffled = questionPool.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(
          0,
          Math.min(10, questionPool.length)
        );

        // Randomiser les options
        const randomizedQuestions = selectedQuestions.map(q => {
          const shuffledOptions = [...q.options].sort(
            () => 0.5 - Math.random()
          );
          return {
            ...q,
            options: shuffledOptions,
          };
        });

        const quiz = new Quiz({
          moduleId: module._id.toString(),
          title: `Quiz - ${module.title}`,
          description: `Évaluez vos connaissances sur ${module.title}`,
          timeLimit: 1800, // 30 minutes
          passingScore: 70,
          questions: randomizedQuestions,
        });

        await quiz.save();
        logger.info(`Created quiz for module: ${module.title}`);
      }
    }

    // Créer des évaluations enrichies pour le profilage
    const assessmentCategories = Object.keys(ENRICHED_ASSESSMENT_QUESTIONS);

    for (const category of assessmentCategories) {
      const assessment = new Assessment({
        title: `${category.toUpperCase()} Assessment`,
        category: category.split("_")[0], // math_basic -> math
        difficulty: category.includes("basic") ? "basic" : "intermediate",
        questions: ENRICHED_ASSESSMENT_QUESTIONS[category],
      });

      await assessment.save();
      logger.info(`Created assessment for: ${category}`);
    }

    // Statistiques finales
    const stats = {
      pathways: await Goal.countDocuments(),
      quizzes: await Quiz.countDocuments(),
      assessments: await Assessment.countDocuments(),
    };

    logger.info("\n=== 🚀 PROGRESSIVE PATHWAYS CREATED ===");
    logger.info(`📚 Total Pathways: ${stats.pathways}`);
    logger.info(`📝 Total Quizzes: ${stats.quizzes}`);
    logger.info(`📊 Total Assessments: ${stats.assessments}`);
    logger.info("\n✅ Structured progressive learning ready!");
  } catch (error) {
    logger.error("Error creating progressive pathways:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Exécuter la création
createProgressivePathways();
