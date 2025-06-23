import express from "express";
import { auth } from "../middleware/auth.js";
import { StudyGroup } from "../models/StudyGroup.js";
import { ForumPost } from "../models/ForumPost.js";
import { SharedResource } from "../models/SharedResource.js";
import { PeerReviewSubmission } from "../models/PeerReview.js";
import { logger } from "../utils/logger.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

// Configuration de multer pour le stockage des fichiers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../uploads");

// Créer le dossier uploads s'il n'existe pas
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|doc|docx|ppt|pptx|zip/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Format de fichier non supporté"));
    }
  },
});

// Routes pour les groupes d'étude
router.get("/study-groups", auth, async (req, res) => {
  try {
    const groups = await StudyGroup.find({
      $or: [{ createdBy: req.user.id }, { members: req.user.id }],
      isActive: true,
    })
      .populate("createdBy", "email")
      .populate("members", "email")
      .sort("-createdAt");

    res.json(groups);
  } catch (error) {
    logger.error("Error fetching study groups:", error);
    res.status(500).json({ error: "Erreur lors du chargement des groupes" });
  }
});

router.post("/study-groups", auth, async (req, res) => {
  try {
    const { name, description, topic } = req.body;

    const group = new StudyGroup({
      name,
      description,
      topic,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    await group.save();
    await group.populate("createdBy", "email");
    await group.populate("members", "email");

    res.status(201).json(group);
  } catch (error) {
    logger.error("Error creating study group:", error);
    res.status(500).json({ error: "Erreur lors de la création du groupe" });
  }
});

router.post("/study-groups/:id/invite", auth, async (req, res) => {
  try {
    const { email } = req.body;
    const group = await StudyGroup.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!group) {
      return res.status(404).json({ error: "Groupe non trouvé" });
    }

    // Trouver l'utilisateur par email
    const User = mongoose.model("User");
    const userToInvite = await User.findOne({ email });

    if (!userToInvite) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Vérifier si l'utilisateur est déjà membre
    if (group.members.includes(userToInvite._id)) {
      return res
        .status(400)
        .json({ error: "L'utilisateur est déjà membre du groupe" });
    }

    // Ajouter l'utilisateur au groupe
    group.members.push(userToInvite._id);
    await group.save();
    await group.populate("createdBy", "email");
    await group.populate("members", "email");

    res.json(group);
  } catch (error) {
    logger.error("Error inviting to study group:", error);
    res.status(500).json({ error: "Erreur lors de l'invitation" });
  }
});

router.post("/study-groups/:id/messages", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const group = await StudyGroup.findOne({
      _id: req.params.id,
      members: req.user.id,
    });

    if (!group) {
      return res.status(404).json({ error: "Groupe non trouvé" });
    }

    group.messages.push({
      sender: req.user.id,
      content,
    });

    await group.save();
    await group.populate("createdBy", "email");
    await group.populate("members", "email");
    await group.populate("messages.sender", "email");

    res.json(group);
  } catch (error) {
    logger.error("Error sending message to study group:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
});

router.post("/study-groups/:id/schedule", auth, async (req, res) => {
  try {
    const { date, duration, topic } = req.body;
    const group = await StudyGroup.findOne({
      _id: req.params.id,
      $or: [{ createdBy: req.user.id }, { members: req.user.id }],
    });

    if (!group) {
      return res.status(404).json({ error: "Groupe non trouvé" });
    }

    group.meetingSchedule = {
      date,
      duration,
      topic,
    };

    await group.save();
    await group.populate("createdBy", "email");
    await group.populate("members", "email");
    await group.populate("messages.sender", "email");

    res.json(group);
  } catch (error) {
    logger.error("Error scheduling meeting:", error);
    res.status(500).json({ error: "Erreur lors de la planification" });
  }
});

// Routes pour le forum de discussion
router.get("/forum/posts", auth, async (req, res) => {
  try {
    const posts = await ForumPost.find({ isActive: true })
      .populate("author", "email")
      .populate("comments.author", "email")
      .sort("-createdAt");

    res.json(posts);
  } catch (error) {
    logger.error("Error fetching forum posts:", error);
    res
      .status(500)
      .json({ error: "Erreur lors du chargement des discussions" });
  }
});

router.post("/forum/posts", auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const post = new ForumPost({
      title,
      content,
      tags,
      author: req.user.id,
    });

    await post.save();
    await post.populate("author", "email");

    res.status(201).json(post);
  } catch (error) {
    logger.error("Error creating forum post:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la discussion" });
  }
});

router.post("/forum/posts/:id/comments", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Discussion non trouvée" });
    }

    post.comments.push({
      author: req.user.id,
      content,
    });

    await post.save();
    await post.populate("author", "email");
    await post.populate("comments.author", "email");

    res.json(post);
  } catch (error) {
    logger.error("Error adding comment to forum post:", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du commentaire" });
  }
});

router.post("/forum/posts/:id/like", auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Discussion non trouvée" });
    }

    // Vérifier si l'utilisateur a déjà liké
    const likeIndex = post.likes.indexOf(req.user.id);

    if (likeIndex === -1) {
      // Ajouter le like
      post.likes.push(req.user.id);
    } else {
      // Retirer le like
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    await post.populate("author", "email");
    await post.populate("comments.author", "email");

    res.json(post);
  } catch (error) {
    logger.error("Error liking forum post:", error);
    res.status(500).json({ error: "Erreur lors de l'action" });
  }
});

// Routes pour le partage de ressources
router.get("/shared-resources", auth, async (req, res) => {
  try {
    const resources = await SharedResource.find({ isActive: true })
      .populate("author", "email")
      .sort("-createdAt");

    res.json(resources);
  } catch (error) {
    logger.error("Error fetching shared resources:", error);
    res.status(500).json({ error: "Erreur lors du chargement des ressources" });
  }
});

router.post("/shared-resources", auth, async (req, res) => {
  try {
    const { title, description, url, type, tags } = req.body;

    const resource = new SharedResource({
      title,
      description,
      url,
      type,
      tags,
      author: req.user.id,
    });

    await resource.save();
    await resource.populate("author", "email");

    res.status(201).json(resource);
  } catch (error) {
    logger.error("Error creating shared resource:", error);
    res.status(500).json({ error: "Erreur lors du partage de la ressource" });
  }
});

router.post("/shared-resources/:id/like", auth, async (req, res) => {
  try {
    const resource = await SharedResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: "Ressource non trouvée" });
    }

    // Vérifier si l'utilisateur a déjà liké
    const likeIndex = resource.likes.indexOf(req.user.id);

    if (likeIndex === -1) {
      // Ajouter le like
      resource.likes.push(req.user.id);
    } else {
      // Retirer le like
      resource.likes.splice(likeIndex, 1);
    }

    await resource.save();
    await resource.populate("author", "email");

    res.json(resource);
  } catch (error) {
    logger.error("Error liking shared resource:", error);
    res.status(500).json({ error: "Erreur lors de l'action" });
  }
});

router.post("/shared-resources/:id/download", auth, async (req, res) => {
  try {
    const resource = await SharedResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: "Ressource non trouvée" });
    }

    // Incrémenter le compteur de téléchargements
    resource.downloads += 1;
    await resource.save();
    await resource.populate("author", "email");

    res.json(resource);
  } catch (error) {
    logger.error("Error downloading shared resource:", error);
    res.status(500).json({ error: "Erreur lors de l'action" });
  }
});

// Routes pour la revue par les pairs
router.get("/peer-review/submissions", auth, async (req, res) => {
  try {
    const submissions = await PeerReviewSubmission.find()
      .populate("author", "email")
      .populate("reviews.reviewer", "email")
      .sort("-createdAt");

    res.json(submissions);
  } catch (error) {
    logger.error("Error fetching peer review submissions:", error);
    res
      .status(500)
      .json({ error: "Erreur lors du chargement des soumissions" });
  }
});

router.post(
  "/peer-review/submissions",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Fichier requis" });
      }

      const { title, description } = req.body;
      const fileUrl = `/uploads/${req.file.filename}`;

      const submission = new PeerReviewSubmission({
        title,
        description,
        fileUrl,
        fileName: req.file.originalname,
        author: req.user.id,
      });

      await submission.save();
      await submission.populate("author", "email");

      res.status(201).json(submission);
    } catch (error) {
      logger.error("Error creating peer review submission:", error);
      res.status(500).json({ error: "Erreur lors de la soumission" });
    }
  }
);

router.post("/peer-review/submissions/:id/reviews", auth, async (req, res) => {
  try {
    const { content, rating } = req.body;
    const submission = await PeerReviewSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ error: "Soumission non trouvée" });
    }

    // Vérifier que l'utilisateur n'est pas l'auteur
    if (submission.author.toString() === req.user.id) {
      return res
        .status(400)
        .json({ error: "Vous ne pouvez pas réviser votre propre travail" });
    }

    // Vérifier que l'utilisateur n'a pas déjà fait une revue
    const existingReview = submission.reviews.find(
      r => r.reviewer.toString() === req.user.id
    );
    if (existingReview) {
      return res.status(400).json({ error: "Vous avez déjà soumis une revue" });
    }

    submission.reviews.push({
      reviewer: req.user.id,
      content,
      rating,
    });

    // Mettre à jour le statut
    if (submission.reviews.length >= 3) {
      submission.status = "completed";
    } else if (submission.reviews.length > 0) {
      submission.status = "reviewed";
    }

    await submission.save();
    await submission.populate("author", "email");
    await submission.populate("reviews.reviewer", "email");

    res.json(submission);
  } catch (error) {
    logger.error("Error submitting peer review:", error);
    res.status(500).json({ error: "Erreur lors de la soumission de la revue" });
  }
});

export const collaborationRoutes = router;
