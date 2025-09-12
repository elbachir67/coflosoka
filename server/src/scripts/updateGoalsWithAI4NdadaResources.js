/**
 * Script pour enrichir les objectifs existants avec les ressources AI4Ndada
 */

import mongoose from "mongoose";
import { Goal } from "../models/LearningGoal.js";
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
    logger.info("MongoDB Connected for AI4Ndada resources integration");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Ressources AI4Ndada à intégrer
const AI4NDADA_RESOURCES = {
  // Ressources mathématiques
  math: [
    {
      title: "Les Vecteurs - Concepts Fondamentaux",
      url: "http://ai4ndada01.surge.sh/modules/math/vectors.html",
      type: "article",
      duration: 90,
      description:
        "Direction + magnitude avec analogie du déplacement urbain. Opérations vectorielles et applications IA.",
    },
    {
      title: "Les Matrices - Transformations et Applications",
      url: "http://ai4ndada01.surge.sh/modules/math/matrices.html",
      type: "article",
      duration: 120,
      description:
        "Matrices comme tableaux de transformations avec analogie GPS. Produit matriciel et applications.",
    },
    {
      title: "Valeurs Propres et Vecteurs Propres",
      url: "http://ai4ndada01.surge.sh/modules/math/eigenvalues.html",
      type: "article",
      duration: 150,
      description:
        "Directions privilégiées avec analogie du ressort. Décomposition eigen et PCA.",
    },
    {
      title: "Les Dérivées - Mesure du Changement",
      url: "http://ai4ndada01.surge.sh/modules/math/derivatives.html",
      type: "article",
      duration: 100,
      description:
        "Dérivées comme vitesse d'une voiture. Règles de dérivation et optimisation.",
    },
    {
      title: "Les Gradients - Optimisation Multivariable",
      url: "http://ai4ndada01.surge.sh/modules/math/gradients.html",
      type: "article",
      duration: 130,
      description:
        "Alpiniste dans le brouillard. Descente de gradient et optimisation automatique.",
    },
    {
      title: "Les Probabilités - Gestion de l'Incertitude",
      url: "http://ai4ndada01.surge.sh/modules/math/probability.html",
      type: "article",
      duration: 110,
      description:
        "Analogie météorologique. Théorème de Bayes et applications IA.",
    },
    {
      title: "Les Statistiques - Analyse de Données",
      url: "http://ai4ndada01.surge.sh/modules/math/statistics.html",
      type: "article",
      duration: 140,
      description:
        "Tendance centrale, dispersion, tests d'hypothèses. Corrélation vs causalité.",
    },
  ],

  // Ressources Python
  python: [
    {
      title: "Python Bases - Écosystème IA",
      url: "http://ai4ndada01.surge.sh/modules/python/basics.html",
      type: "article",
      duration: 180,
      description:
        "Pourquoi Python domine l'IA. Fondamentaux avec exemples sénégalais et système de recommandation.",
    },
    {
      title: "NumPy - Révolution du Calcul Numérique",
      url: "http://ai4ndada01.surge.sh/modules/python/numpy.html",
      type: "article",
      duration: 150,
      description:
        "100x plus rapide que les listes. Arrays, broadcasting, algèbre linéaire avec données locales.",
    },
    {
      title: "Pandas - Excel Killer pour l'IA",
      url: "http://ai4ndada01.surge.sh/modules/python/pandas.html",
      type: "article",
      duration: 160,
      description:
        "DataFrames intelligents. Nettoyage de données, analyses groupées, préparation pour l'IA.",
    },
    {
      title: "Matplotlib - Visualisation Puissante",
      url: "http://ai4ndada01.surge.sh/modules/python/matplotlib.html",
      type: "article",
      duration: 120,
      description:
        "60 000x plus rapide que les chiffres. Graphiques avec données sénégalaises et tableau de bord.",
    },
    {
      title: "Algorithmes - Efficacité Cruciale en IA",
      url: "http://ai4ndada01.surge.sh/modules/python/algorithms.html",
      type: "article",
      duration: 140,
      description:
        "Recherche optimisée (marché de Sandaga), structures de données, complexité.",
    },
  ],

  // Ressources ML
  ml: [
    {
      title: "Introduction ML - Révolution de l'Apprentissage",
      url: "http://ai4ndada01.surge.sh/modules/ml/introduction.html",
      type: "article",
      duration: 120,
      description:
        "Essence du ML, 3 types d'apprentissage, biais vs variance. Exemple : prédiction prix du mil.",
    },
  ],
};

async function updateGoalsWithAI4NdadaResources() {
  try {
    await connectDB();

    logger.info("Starting integration of AI4Ndada resources...");

    // Récupérer tous les objectifs existants
    const goals = await Goal.find();
    logger.info(`Found ${goals.length} existing goals`);

    for (const goal of goals) {
      let updated = false;

      // Enrichir selon la catégorie de l'objectif
      switch (goal.category) {
        case "ml":
          // Ajouter les ressources mathématiques et Python + ML
          goal.modules.forEach(module => {
            // Ajouter ressources mathématiques si le module traite de fondamentaux
            if (
              module.title.toLowerCase().includes("fondament") ||
              module.title.toLowerCase().includes("introduction") ||
              module.title.toLowerCase().includes("base")
            ) {
              // Ajouter ressources mathématiques essentielles
              const mathResources = [
                AI4NDADA_RESOURCES.math[0], // Vecteurs
                AI4NDADA_RESOURCES.math[1], // Matrices
                AI4NDADA_RESOURCES.math[3], // Dérivées
                AI4NDADA_RESOURCES.math[6], // Statistiques
              ];

              mathResources.forEach(resource => {
                if (!module.resources.some(r => r.url === resource.url)) {
                  module.resources.push(resource);
                  updated = true;
                }
              });

              // Ajouter ressources Python essentielles
              const pythonResources = [
                AI4NDADA_RESOURCES.python[0], // Python Bases
                AI4NDADA_RESOURCES.python[1], // NumPy
                AI4NDADA_RESOURCES.python[2], // Pandas
              ];

              pythonResources.forEach(resource => {
                if (!module.resources.some(r => r.url === resource.url)) {
                  module.resources.push(resource);
                  updated = true;
                }
              });

              // Ajouter ressource ML introduction
              if (
                !module.resources.some(
                  r => r.url === AI4NDADA_RESOURCES.ml[0].url
                )
              ) {
                module.resources.push(AI4NDADA_RESOURCES.ml[0]);
                updated = true;
              }
            }

            // Pour les modules avancés, ajouter ressources mathématiques avancées
            if (
              module.title.toLowerCase().includes("avancé") ||
              module.title.toLowerCase().includes("optimisation")
            ) {
              const advancedMathResources = [
                AI4NDADA_RESOURCES.math[2], // Valeurs propres
                AI4NDADA_RESOURCES.math[4], // Gradients
                AI4NDADA_RESOURCES.math[5], // Probabilités
              ];

              advancedMathResources.forEach(resource => {
                if (!module.resources.some(r => r.url === resource.url)) {
                  module.resources.push(resource);
                  updated = true;
                }
              });
            }
          });
          break;

        case "dl":
          // Pour Deep Learning, ajouter toutes les ressources mathématiques et Python avancées
          goal.modules.forEach(module => {
            if (
              module.title.toLowerCase().includes("fondament") ||
              module.title.toLowerCase().includes("introduction")
            ) {
              // Ressources mathématiques complètes pour DL
              AI4NDADA_RESOURCES.math.forEach(resource => {
                if (!module.resources.some(r => r.url === resource.url)) {
                  module.resources.push(resource);
                  updated = true;
                }
              });

              // Ressources Python complètes
              AI4NDADA_RESOURCES.python.forEach(resource => {
                if (!module.resources.some(r => r.url === resource.url)) {
                  module.resources.push(resource);
                  updated = true;
                }
              });
            }
          });
          break;

        case "computer_vision":
          // Pour Computer Vision, ajouter ressources mathématiques spécifiques
          goal.modules.forEach(module => {
            const cvMathResources = [
              AI4NDADA_RESOURCES.math[0], // Vecteurs
              AI4NDADA_RESOURCES.math[1], // Matrices
              AI4NDADA_RESOURCES.math[2], // Valeurs propres (PCA)
              AI4NDADA_RESOURCES.math[4], // Gradients
            ];

            cvMathResources.forEach(resource => {
              if (!module.resources.some(r => r.url === resource.url)) {
                module.resources.push(resource);
                updated = true;
              }
            });

            // Ressources Python pour traitement d'images
            const pythonResources = [
              AI4NDADA_RESOURCES.python[1], // NumPy
              AI4NDADA_RESOURCES.python[3], // Matplotlib
            ];

            pythonResources.forEach(resource => {
              if (!module.resources.some(r => r.url === resource.url)) {
                module.resources.push(resource);
                updated = true;
              }
            });
          });
          break;

        case "nlp":
          // Pour NLP, ajouter ressources mathématiques et Python spécifiques
          goal.modules.forEach(module => {
            const nlpMathResources = [
              AI4NDADA_RESOURCES.math[0], // Vecteurs (embeddings)
              AI4NDADA_RESOURCES.math[5], // Probabilités
              AI4NDADA_RESOURCES.math[6], // Statistiques
            ];

            nlpMathResources.forEach(resource => {
              if (!module.resources.some(r => r.url === resource.url)) {
                module.resources.push(resource);
                updated = true;
              }
            });

            // Ressources Python pour NLP
            const pythonResources = [
              AI4NDADA_RESOURCES.python[0], // Python Bases
              AI4NDADA_RESOURCES.python[1], // NumPy
              AI4NDADA_RESOURCES.python[2], // Pandas
            ];

            pythonResources.forEach(resource => {
              if (!module.resources.some(r => r.url === resource.url)) {
                module.resources.push(resource);
                updated = true;
              }
            });
          });
          break;

        case "data_science":
          // Pour Data Science, ajouter toutes les ressources mathématiques et Python
          goal.modules.forEach(module => {
            // Ressources mathématiques pour data science
            const dataScienceMathResources = [
              AI4NDADA_RESOURCES.math[6], // Statistiques
              AI4NDADA_RESOURCES.math[5], // Probabilités
              AI4NDADA_RESOURCES.math[0], // Vecteurs
              AI4NDADA_RESOURCES.math[1], // Matrices
            ];

            dataScienceMathResources.forEach(resource => {
              if (!module.resources.some(r => r.url === resource.url)) {
                module.resources.push(resource);
                updated = true;
              }
            });

            // Toutes les ressources Python pour data science
            AI4NDADA_RESOURCES.python.forEach(resource => {
              if (!module.resources.some(r => r.url === resource.url)) {
                module.resources.push(resource);
                updated = true;
              }
            });
          });
          break;

        case "mlops":
          // Pour MLOps, ajouter ressources Python et algorithmes
          goal.modules.forEach(module => {
            const mlopsResources = [
              AI4NDADA_RESOURCES.python[0], // Python Bases
              AI4NDADA_RESOURCES.python[1], // NumPy
              AI4NDADA_RESOURCES.python[4], // Algorithmes
            ];

            mlopsResources.forEach(resource => {
              if (!module.resources.some(r => r.url === resource.url)) {
                module.resources.push(resource);
                updated = true;
              }
            });
          });
          break;
      }

      // Sauvegarder si des modifications ont été apportées
      if (updated) {
        await goal.save();
        logger.info(`Updated goal "${goal.title}" with AI4Ndada resources`);
      }
    }

    // Créer un objectif spécifique "Fondamentaux Mathématiques" si il n'existe pas
    const mathGoalExists = await Goal.findOne({
      title: { $regex: /fondamentaux.*mathématiques/i },
    });

    if (!mathGoalExists) {
      const mathGoal = new Goal({
        title: "Fondamentaux Mathématiques pour l'IA",
        description:
          "Maîtrisez les concepts mathématiques essentiels pour comprendre et appliquer l'intelligence artificielle avec des analogies concrètes et des exemples pratiques.",
        category: "math",
        level: "beginner",
        estimatedDuration: 10,
        prerequisites: [],
        modules: [
          {
            title: "Algèbre Linéaire Fondamentale",
            description:
              "Vecteurs, matrices et transformations avec analogies du quotidien",
            duration: 25,
            skills: [
              { name: "Vecteurs", level: "intermediate" },
              { name: "Matrices", level: "intermediate" },
              { name: "Valeurs propres", level: "basic" },
            ],
            resources: [
              AI4NDADA_RESOURCES.math[0], // Vecteurs
              AI4NDADA_RESOURCES.math[1], // Matrices
              AI4NDADA_RESOURCES.math[2], // Valeurs propres
            ],
            validationCriteria: [
              "Maîtriser les opérations vectorielles",
              "Comprendre les transformations matricielles",
              "Appliquer la décomposition eigen",
            ],
          },
          {
            title: "Calcul Différentiel et Optimisation",
            description:
              "Dérivées, gradients et techniques d'optimisation pour l'IA",
            duration: 20,
            skills: [
              { name: "Dérivées", level: "intermediate" },
              { name: "Gradients", level: "intermediate" },
              { name: "Optimisation", level: "basic" },
            ],
            resources: [
              AI4NDADA_RESOURCES.math[3], // Dérivées
              AI4NDADA_RESOURCES.math[4], // Gradients
            ],
            validationCriteria: [
              "Calculer des dérivées complexes",
              "Comprendre la descente de gradient",
              "Optimiser des fonctions multivariables",
            ],
          },
          {
            title: "Probabilités et Statistiques",
            description:
              "Gestion de l'incertitude et analyse de données pour l'IA",
            duration: 20,
            skills: [
              { name: "Probabilités", level: "intermediate" },
              { name: "Statistiques", level: "intermediate" },
              { name: "Inférence", level: "basic" },
            ],
            resources: [
              AI4NDADA_RESOURCES.math[5], // Probabilités
              AI4NDADA_RESOURCES.math[6], // Statistiques
            ],
            validationCriteria: [
              "Appliquer le théorème de Bayes",
              "Analyser des distributions",
              "Distinguer corrélation et causalité",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "Data Analyst",
            description: "Analyste de données avec solides bases mathématiques",
            averageSalary: "35-50k€/an",
            companies: ["Banques", "Assurances", "Instituts de recherche"],
          },
        ],
        certification: {
          available: true,
          name: "Certificat Mathématiques pour l'IA",
          provider: "UCAD AI Center",
          url: "https://ucad.sn/certifications/math-ai",
        },
      });

      await mathGoal.save();
      logger.info(
        "Created 'Fondamentaux Mathématiques pour l'IA' goal with AI4Ndada resources"
      );
    }

    // Créer un objectif spécifique "Programmation Python pour l'IA" si il n'existe pas
    const pythonGoalExists = await Goal.findOne({
      title: { $regex: /python.*ia/i },
    });

    if (!pythonGoalExists) {
      const pythonGoal = new Goal({
        title: "Programmation Python pour l'IA",
        description:
          "Maîtrisez l'écosystème Python pour l'intelligence artificielle, des bases aux bibliothèques spécialisées, avec des exemples pratiques et des projets concrets.",
        category: "programming",
        level: "beginner",
        estimatedDuration: 8,
        prerequisites: [
          {
            category: "math",
            skills: [{ name: "Algèbre de base", level: "basic" }],
          },
        ],
        modules: [
          {
            title: "Python Fondamentaux et Écosystème IA",
            description: "Bases de Python avec focus sur l'écosystème IA",
            duration: 20,
            skills: [
              { name: "Python", level: "intermediate" },
              { name: "Structures de données", level: "intermediate" },
            ],
            resources: [
              AI4NDADA_RESOURCES.python[0], // Python Bases
            ],
            validationCriteria: [
              "Maîtriser la syntaxe Python",
              "Utiliser les structures de données",
              "Créer des fonctions et classes",
            ],
          },
          {
            title: "Calcul Numérique avec NumPy",
            description: "Révolution du calcul numérique pour l'IA",
            duration: 15,
            skills: [
              { name: "NumPy", level: "advanced" },
              { name: "Calcul vectoriel", level: "intermediate" },
            ],
            resources: [
              AI4NDADA_RESOURCES.python[1], // NumPy
            ],
            validationCriteria: [
              "Maîtriser les arrays NumPy",
              "Utiliser le broadcasting",
              "Optimiser les calculs",
            ],
          },
          {
            title: "Analyse de Données avec Pandas",
            description: "Manipulation et analyse de données pour l'IA",
            duration: 18,
            skills: [
              { name: "Pandas", level: "advanced" },
              { name: "Data cleaning", level: "intermediate" },
            ],
            resources: [
              AI4NDADA_RESOURCES.python[2], // Pandas
            ],
            validationCriteria: [
              "Manipuler des DataFrames",
              "Nettoyer des données réelles",
              "Préparer des données pour l'IA",
            ],
          },
          {
            title: "Visualisation et Algorithmes",
            description: "Visualisation de données et algorithmes efficaces",
            duration: 15,
            skills: [
              { name: "Matplotlib", level: "intermediate" },
              { name: "Algorithmes", level: "intermediate" },
            ],
            resources: [
              AI4NDADA_RESOURCES.python[3], // Matplotlib
              AI4NDADA_RESOURCES.python[4], // Algorithmes
            ],
            validationCriteria: [
              "Créer des visualisations professionnelles",
              "Implémenter des algorithmes efficaces",
              "Analyser la complexité",
            ],
          },
        ],
        careerOpportunities: [
          {
            title: "Python Developer IA",
            description:
              "Développeur Python spécialisé en intelligence artificielle",
            averageSalary: "45-70k€/an",
            companies: ["Startups IA", "Fintech", "Entreprises tech"],
          },
        ],
        certification: {
          available: true,
          name: "Certificat Python pour l'IA",
          provider: "UCAD Programming Center",
          url: "https://ucad.sn/certifications/python-ai",
        },
      });

      await pythonGoal.save();
      logger.info(
        "Created 'Programmation Python pour l'IA' goal with AI4Ndada resources"
      );
    }

    logger.info(
      "Successfully integrated AI4Ndada resources into existing goals"
    );

    // Statistiques finales
    const updatedGoals = await Goal.find();
    const totalResources = updatedGoals.reduce((sum, goal) => {
      return (
        sum +
        goal.modules.reduce((moduleSum, module) => {
          return moduleSum + module.resources.length;
        }, 0)
      );
    }, 0);

    logger.info(`Total goals: ${updatedGoals.length}`);
    logger.info(`Total resources across all goals: ${totalResources}`);
    logger.info("AI4Ndada resources successfully integrated!");
  } catch (error) {
    logger.error("Error updating goals with AI4Ndada resources:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Exécuter le script
updateGoalsWithAI4NdadaResources();
