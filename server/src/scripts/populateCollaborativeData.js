import mongoose from "mongoose";
import { User } from "../models/User.js";
import { StudyGroup } from "../models/StudyGroup.js";
import { ForumPost } from "../models/ForumPost.js";
import { SharedResource } from "../models/SharedResource.js";
import { PeerReviewSubmission } from "../models/PeerReview.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB for collaborative data population");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

async function populateStudyGroups() {
  try {
    // Récupérer quelques utilisateurs pour créer des groupes
    const users = await User.find().limit(5);

    if (users.length < 3) {
      logger.warn("Not enough users for study groups");
      return;
    }

    const studyGroups = [
      {
        name: "Groupe d'étude Machine Learning",
        description: "Groupe pour discuter et pratiquer les concepts de ML",
        topic: "Machine Learning",
        createdBy: users[0]._id,
        members: [users[0]._id, users[1]._id, users[2]._id],
        messages: [
          {
            sender: users[0]._id,
            content: "Bienvenue dans notre groupe d'étude ML !",
          },
          {
            sender: users[1]._id,
            content:
              "Merci pour l'invitation. Quels sujets allons-nous aborder en premier ?",
          },
          {
            sender: users[0]._id,
            content:
              "Je propose de commencer par les algorithmes de classification.",
          },
        ],
        meetingSchedule: {
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans 7 jours
          duration: 60,
          topic: "Algorithmes de classification supervisée",
        },
      },
      {
        name: "Deep Learning Avancé",
        description:
          "Exploration des architectures de réseaux de neurones modernes",
        topic: "Deep Learning",
        createdBy: users[1]._id,
        members: [users[1]._id, users[3]._id],
        messages: [
          {
            sender: users[1]._id,
            content: "Bienvenue dans le groupe Deep Learning Avancé !",
          },
          {
            sender: users[3]._id,
            content:
              "Je suis très intéressé par les Transformers, pouvons-nous les étudier ?",
          },
        ],
      },
      {
        name: "Computer Vision Pratique",
        description: "Applications pratiques de la vision par ordinateur",
        topic: "Computer Vision",
        createdBy: users[2]._id,
        members: [users[2]._id, users[0]._id, users[4]._id],
        messages: [
          {
            sender: users[2]._id,
            content:
              "Bienvenue à tous dans ce groupe dédié à la vision par ordinateur !",
          },
          {
            sender: users[4]._id,
            content:
              "J'aimerais travailler sur un projet de détection d'objets.",
          },
          {
            sender: users[0]._id,
            content:
              "Excellente idée ! Je suggère d'utiliser YOLO pour commencer.",
          },
        ],
      },
    ];

    // Vérifier si des groupes existent déjà
    const existingCount = await StudyGroup.countDocuments();
    if (existingCount > 0) {
      logger.info(`${existingCount} study groups already exist, skipping...`);
    } else {
      await StudyGroup.insertMany(studyGroups);
      logger.info(`Created ${studyGroups.length} study groups`);
    }
  } catch (error) {
    logger.error("Error populating study groups:", error);
  }
}

async function populateForumPosts() {
  try {
    // Récupérer quelques utilisateurs pour créer des posts
    const users = await User.find().limit(5);

    if (users.length < 3) {
      logger.warn("Not enough users for forum posts");
      return;
    }

    const forumPosts = [
      {
        title: "Comment optimiser l'entraînement des CNNs ?",
        content:
          "J'ai remarqué que l'entraînement de mes réseaux de neurones convolutifs prend beaucoup de temps. Quelles sont vos astuces pour optimiser ce processus ?\n\nJ'ai essayé d'utiliser des batch plus grands, mais je me heurte aux limites de ma mémoire GPU. Y a-t-il d'autres approches ?",
        author: users[0]._id,
        tags: ["CNN", "Optimisation", "GPU", "Deep Learning"],
        likes: [users[1]._id, users[2]._id],
        comments: [
          {
            author: users[1]._id,
            content:
              "Tu pourrais essayer la mixed precision training. Ça réduit considérablement la mémoire utilisée et accélère l'entraînement sur les GPUs récents.",
          },
          {
            author: users[2]._id,
            content:
              "Je recommande aussi de regarder du côté de la data augmentation pour améliorer les performances sans augmenter la taille du modèle.",
          },
        ],
      },
      {
        title: "Ressources pour apprendre le NLP en 2025",
        content:
          "Bonjour à tous,\n\nJe cherche des ressources à jour pour apprendre le traitement du langage naturel en 2025. Les livres que j'ai trouvés datent de 2021 et ne couvrent pas les derniers développements.\n\nAvez-vous des recommandations de cours, articles ou tutoriels récents ?",
        author: users[1]._id,
        tags: ["NLP", "Ressources", "Apprentissage"],
        likes: [users[0]._id, users[3]._id, users[4]._id],
        comments: [
          {
            author: users[3]._id,
            content:
              "Je te conseille le cours de Stanford CS324 sur les LLMs, il est mis à jour régulièrement.",
          },
          {
            author: users[0]._id,
            content:
              "Le livre 'Natural Language Processing with Transformers' de Lewis Tunstall est excellent et a été mis à jour récemment.",
          },
        ],
      },
      {
        title: "Projet collaboratif : détection de fraude financière",
        content:
          "Je cherche des collaborateurs pour un projet de détection de fraude financière utilisant des techniques de ML.\n\nL'idée est de développer un système qui pourrait être utile pour les institutions financières en Afrique.\n\nCompétences recherchées : Python, scikit-learn, expérience en finance (optionnel).\n\nQui serait intéressé ?",
        author: users[2]._id,
        tags: ["Projet", "Collaboration", "Finance", "ML"],
        likes: [users[0]._id, users[4]._id],
        comments: [
          {
            author: users[4]._id,
            content:
              "Ça m'intéresse ! J'ai travaillé sur des projets similaires et j'ai une bonne connaissance de scikit-learn.",
          },
          {
            author: users[0]._id,
            content:
              "Je serais intéressé aussi. As-tu déjà un dataset en tête ?",
          },
          {
            author: users[2]._id,
            content:
              "Super ! Je pensais utiliser le dataset Kaggle 'IEEE-CIS Fraud Detection' comme point de départ, puis l'adapter à notre contexte.",
          },
        ],
      },
      {
        title: "Problème avec TensorFlow sur M1",
        content:
          "Depuis que j'ai mis à jour vers la dernière version de TensorFlow, j'ai des erreurs sur mon MacBook M1. Quelqu'un a-t-il rencontré ce problème ?\n\nErreur : `Illegal instruction: 4`\n\nJ'ai essayé de réinstaller mais ça ne résout pas le problème.",
        author: users[3]._id,
        tags: ["TensorFlow", "M1", "MacOS", "Dépannage"],
        likes: [users[1]._id],
        comments: [
          {
            author: users[1]._id,
            content:
              "J'ai eu le même problème. Tu dois installer la version spécifique pour Apple Silicon : `pip install tensorflow-macos`",
          },
        ],
      },
    ];

    // Vérifier si des posts existent déjà
    const existingCount = await ForumPost.countDocuments();
    if (existingCount > 0) {
      logger.info(`${existingCount} forum posts already exist, skipping...`);
    } else {
      await ForumPost.insertMany(forumPosts);
      logger.info(`Created ${forumPosts.length} forum posts`);
    }
  } catch (error) {
    logger.error("Error populating forum posts:", error);
  }
}

async function populateSharedResources() {
  try {
    // Récupérer quelques utilisateurs pour créer des ressources
    const users = await User.find().limit(5);

    if (users.length < 3) {
      logger.warn("Not enough users for shared resources");
      return;
    }

    const sharedResources = [
      {
        title: "Guide complet des Transformers",
        description:
          "Un guide détaillé sur l'architecture Transformer, de la théorie à l'implémentation pratique avec PyTorch.",
        url: "https://huggingface.co/course/chapter1/1",
        type: "course",
        tags: ["Transformers", "NLP", "PyTorch", "Deep Learning"],
        author: users[0]._id,
        likes: [users[1]._id, users[2]._id, users[3]._id],
        downloads: 42,
      },
      {
        title: "Introduction à scikit-learn",
        description:
          "Tutoriel complet pour débutants sur scikit-learn avec exemples pratiques.",
        url: "https://scikit-learn.org/stable/tutorial/index.html",
        type: "article",
        tags: ["scikit-learn", "ML", "Python", "Débutant"],
        author: users[1]._id,
        likes: [users[0]._id, users[4]._id],
        downloads: 28,
      },
      {
        title: "Cours CS231n de Stanford sur la Vision par Ordinateur",
        description:
          "Cours complet de Stanford sur les réseaux de neurones convolutifs pour la vision par ordinateur.",
        url: "http://cs231n.stanford.edu/",
        type: "course",
        tags: ["Computer Vision", "CNN", "Deep Learning", "Stanford"],
        author: users[2]._id,
        likes: [users[0]._id, users[1]._id, users[3]._id],
        downloads: 56,
      },
      {
        title: "Implémentation de YOLO v8 pour la détection d'objets",
        description:
          "Guide pas à pas pour implémenter et fine-tuner YOLO v8 sur votre propre dataset.",
        url: "https://github.com/ultralytics/ultralytics",
        type: "use_case",
        tags: ["YOLO", "Object Detection", "Computer Vision", "Tutoriel"],
        author: users[3]._id,
        likes: [users[0]._id, users[2]._id],
        downloads: 35,
      },
      {
        title: "Deep Learning for Coders with fastai and PyTorch",
        description:
          "Livre gratuit en ligne pour apprendre le deep learning de manière pratique avec fastai.",
        url: "https://github.com/fastai/fastbook",
        type: "book",
        tags: ["fastai", "PyTorch", "Deep Learning", "Pratique"],
        author: users[4]._id,
        likes: [users[0]._id, users[1]._id, users[2]._id, users[3]._id],
        downloads: 67,
      },
    ];

    // Vérifier si des ressources existent déjà
    const existingCount = await SharedResource.countDocuments();
    if (existingCount > 0) {
      logger.info(
        `${existingCount} shared resources already exist, skipping...`
      );
    } else {
      await SharedResource.insertMany(sharedResources);
      logger.info(`Created ${sharedResources.length} shared resources`);
    }
  } catch (error) {
    logger.error("Error populating shared resources:", error);
  }
}

async function populatePeerReviews() {
  try {
    // Récupérer quelques utilisateurs pour créer des soumissions
    const users = await User.find().limit(5);

    if (users.length < 3) {
      logger.warn("Not enough users for peer reviews");
      return;
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Créer des fichiers d'exemple pour les revues par les pairs
    const sampleFiles = [
      "sample-document-1.pdf",
      "sample-document-2.pdf",
      "sample-document-3.pdf",
    ];

    for (const file of sampleFiles) {
      const filePath = path.join(uploadsDir, file);
      if (!fs.existsSync(filePath)) {
        // Créer un fichier vide
        fs.writeFileSync(filePath, "Sample document content");
        logger.info(`Created sample file: ${file}`);
      }
    }

    const peerReviewSubmissions = [
      {
        title: "Analyse comparative des algorithmes de classification",
        description:
          "Une étude comparative des performances de différents algorithmes de classification sur des datasets standards.",
        fileUrl: "/uploads/sample-document-1.pdf",
        fileName: "classification-algorithms-comparison.pdf",
        author: users[0]._id,
        status: "reviewed",
        reviews: [
          {
            reviewer: users[1]._id,
            content:
              "Excellente analyse avec des comparaisons pertinentes. J'aurais aimé voir plus de détails sur les hyperparamètres utilisés.",
            rating: 4,
          },
          {
            reviewer: users[2]._id,
            content:
              "Très bon travail. La méthodologie est claire et les résultats sont bien présentés. Quelques graphiques supplémentaires auraient été utiles.",
            rating: 5,
          },
        ],
      },
      {
        title: "Implémentation d'un système de recommandation",
        description:
          "Projet d'implémentation d'un système de recommandation basé sur le filtrage collaboratif et le content-based filtering.",
        fileUrl: "/uploads/sample-document-2.pdf",
        fileName: "recommendation-system-implementation.pdf",
        author: users[1]._id,
        status: "pending",
        reviews: [],
      },
      {
        title: "Détection d'anomalies dans les séries temporelles",
        description:
          "Méthodes de détection d'anomalies appliquées aux données de séries temporelles financières.",
        fileUrl: "/uploads/sample-document-3.pdf",
        fileName: "anomaly-detection-time-series.pdf",
        author: users[2]._id,
        status: "completed",
        reviews: [
          {
            reviewer: users[0]._id,
            content:
              "Travail impressionnant ! Les méthodes sont bien expliquées et les résultats sont convaincants.",
            rating: 5,
          },
          {
            reviewer: users[3]._id,
            content:
              "Bonne approche méthodologique. J'aurais suggéré d'inclure une comparaison avec des méthodes basées sur les autoencoders.",
            rating: 4,
          },
          {
            reviewer: users[4]._id,
            content:
              "Excellent travail. La partie sur l'interprétation des résultats est particulièrement bien développée.",
            rating: 5,
          },
        ],
      },
    ];

    // Vérifier si des soumissions existent déjà
    const existingCount = await PeerReviewSubmission.countDocuments();
    if (existingCount > 0) {
      logger.info(
        `${existingCount} peer review submissions already exist, skipping...`
      );
    } else {
      await PeerReviewSubmission.insertMany(peerReviewSubmissions);
      logger.info(
        `Created ${peerReviewSubmissions.length} peer review submissions`
      );
    }
  } catch (error) {
    logger.error("Error populating peer review submissions:", error);
  }
}

async function populateCollaborativeData() {
  try {
    await connectDB();

    logger.info("Starting collaborative data population...");

    // Peupler les données collaboratives
    await populateStudyGroups();
    await populateForumPosts();
    await populateSharedResources();
    await populatePeerReviews();

    // Statistiques finales
    const stats = {
      studyGroups: await StudyGroup.countDocuments(),
      forumPosts: await ForumPost.countDocuments(),
      sharedResources: await SharedResource.countDocuments(),
      peerReviewSubmissions: await PeerReviewSubmission.countDocuments(),
    };

    logger.info("\n=== 🚀 COLLABORATIVE DATA POPULATION COMPLETED ===");
    logger.info(`👥 Study Groups: ${stats.studyGroups}`);
    logger.info(`💬 Forum Posts: ${stats.forumPosts}`);
    logger.info(`📚 Shared Resources: ${stats.sharedResources}`);
    logger.info(`📝 Peer Review Submissions: ${stats.peerReviewSubmissions}`);
    logger.info("\n✅ Collaborative features are ready to use!");
  } catch (error) {
    logger.error("Error during collaborative data population:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Exécuter le peuplement
populateCollaborativeData();
