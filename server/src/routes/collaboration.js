import express from "express";
import { auth, adminAuth } from "../middleware/auth.js";
import { ForumPost } from "../models/ForumPost.js";
import { SharedResource } from "../models/SharedResource.js";
import { StudyGroup } from "../models/StudyGroup.js";
import { PeerReviewSubmission } from "../models/PeerReview.js";
import { logger } from "../utils/logger.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configuration multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/zip",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Type de fichier non autorisé"), false);
    }
  },
});

// ==================== FORUM POSTS ====================

// Get all forum posts
router.get("/forum/posts", auth, async (req, res) => {
  try {
    const posts = await ForumPost.find({ isActive: true })
      .populate("author", "email")
      .populate("comments.author", "email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    logger.error("Error fetching forum posts:", error);
    res.status(500).json({ error: "Erreur lors du chargement des posts" });
  }
});

// Create forum post
router.post("/forum/posts", auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const post = new ForumPost({
      title,
      content,
      author: req.user._id,
      tags: tags || [],
    });

    await post.save();
    await post.populate("author", "email");

    res.status(201).json(post);
  } catch (error) {
    logger.error("Error creating forum post:", error);
    res.status(500).json({ error: "Erreur lors de la création du post" });
  }
});

// Update forum post (author or admin only)
router.put("/forum/posts/:id", auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const postId = req.params.id;

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post non trouvé" });
    }

    // Check if user is author or admin
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    post.title = title;
    post.content = content;
    post.tags = tags || [];

    await post.save();
    await post.populate("author", "email");

    res.json(post);
  } catch (error) {
    logger.error("Error updating forum post:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du post" });
  }
});

// Delete forum post (author or admin only)
router.delete("/forum/posts/:id", auth, async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post non trouvé" });
    }

    // Check if user is author or admin
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    await ForumPost.findByIdAndDelete(postId);
    res.json({ message: "Post supprimé avec succès" });
  } catch (error) {
    logger.error("Error deleting forum post:", error);
    res.status(500).json({ error: "Erreur lors de la suppression du post" });
  }
});

// Like/unlike forum post
router.post("/forum/posts/:id/like", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post non trouvé" });
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    await post.populate("author", "email");

    res.json(post);
  } catch (error) {
    logger.error("Error liking forum post:", error);
    res.status(500).json({ error: "Erreur lors de l'action" });
  }
});

// Add comment to forum post
router.post("/forum/posts/:id/comments", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post non trouvé" });
    }

    post.comments.push({
      author: req.user._id,
      content,
    });

    await post.save();
    await post.populate("author", "email");
    await post.populate("comments.author", "email");

    res.json(post);
  } catch (error) {
    logger.error("Error adding comment:", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du commentaire" });
  }
});

// Update comment (author or admin only)
router.put(
  "/forum/posts/:postId/comments/:commentId",
  auth,
  async (req, res) => {
    try {
      const { content } = req.body;
      const { postId, commentId } = req.params;

      const post = await ForumPost.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post non trouvé" });
      }

      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ error: "Commentaire non trouvé" });
      }

      // Check if user is comment author or admin
      if (
        comment.author.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ error: "Non autorisé" });
      }

      comment.content = content;
      await post.save();
      await post.populate("author", "email");
      await post.populate("comments.author", "email");

      res.json(post);
    } catch (error) {
      logger.error("Error updating comment:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la mise à jour du commentaire" });
    }
  }
);

// Delete comment (author or admin only)
router.delete(
  "/forum/posts/:postId/comments/:commentId",
  auth,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;

      const post = await ForumPost.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post non trouvé" });
      }

      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ error: "Commentaire non trouvé" });
      }

      // Check if user is comment author or admin
      if (
        comment.author.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ error: "Non autorisé" });
      }

      post.comments.pull(commentId);
      await post.save();
      await post.populate("author", "email");
      await post.populate("comments.author", "email");

      res.json(post);
    } catch (error) {
      logger.error("Error deleting comment:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression du commentaire" });
    }
  }
);

// ==================== SHARED RESOURCES ====================

// Get all shared resources
router.get("/shared-resources", auth, async (req, res) => {
  try {
    const resources = await SharedResource.find({ isActive: true })
      .populate("author", "email")
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    logger.error("Error fetching shared resources:", error);
    res.status(500).json({ error: "Erreur lors du chargement des ressources" });
  }
});

// Create shared resource
router.post("/shared-resources", auth, async (req, res) => {
  try {
    const { title, description, url, type, tags } = req.body;

    const resource = new SharedResource({
      title,
      description,
      url,
      type,
      tags: tags || [],
      author: req.user._id,
    });

    await resource.save();
    await resource.populate("author", "email");

    res.status(201).json(resource);
  } catch (error) {
    logger.error("Error creating shared resource:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la ressource" });
  }
});

// Update shared resource (author or admin only)
router.put("/shared-resources/:id", auth, async (req, res) => {
  try {
    const { title, description, url, type, tags } = req.body;
    const resourceId = req.params.id;

    const resource = await SharedResource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: "Ressource non trouvée" });
    }

    // Check if user is author or admin
    if (
      resource.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    resource.title = title;
    resource.description = description;
    resource.url = url;
    resource.type = type;
    resource.tags = tags || [];

    await resource.save();
    await resource.populate("author", "email");

    res.json(resource);
  } catch (error) {
    logger.error("Error updating shared resource:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la ressource" });
  }
});

// Delete shared resource (author or admin only)
router.delete("/shared-resources/:id", auth, async (req, res) => {
  try {
    const resourceId = req.params.id;

    const resource = await SharedResource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: "Ressource non trouvée" });
    }

    // Check if user is author or admin
    if (
      resource.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    await SharedResource.findByIdAndDelete(resourceId);
    res.json({ message: "Ressource supprimée avec succès" });
  } catch (error) {
    logger.error("Error deleting shared resource:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la ressource" });
  }
});

// Like/unlike shared resource
router.post("/shared-resources/:id/like", auth, async (req, res) => {
  try {
    const resourceId = req.params.id;
    const userId = req.user._id;

    const resource = await SharedResource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: "Ressource non trouvée" });
    }

    const likeIndex = resource.likes.indexOf(userId);
    if (likeIndex > -1) {
      resource.likes.splice(likeIndex, 1);
    } else {
      resource.likes.push(userId);
    }

    await resource.save();
    await resource.populate("author", "email");

    res.json(resource);
  } catch (error) {
    logger.error("Error liking shared resource:", error);
    res.status(500).json({ error: "Erreur lors de l'action" });
  }
});

// Download shared resource
router.post("/shared-resources/:id/download", auth, async (req, res) => {
  try {
    const resourceId = req.params.id;

    const resource = await SharedResource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: "Ressource non trouvée" });
    }

    resource.downloads += 1;
    await resource.save();
    await resource.populate("author", "email");

    res.json(resource);
  } catch (error) {
    logger.error("Error downloading shared resource:", error);
    res.status(500).json({ error: "Erreur lors du téléchargement" });
  }
});

// ==================== STUDY GROUPS ====================

// Get all study groups
router.get("/study-groups", auth, async (req, res) => {
  try {
    const groups = await StudyGroup.find({ isActive: true })
      .populate("createdBy", "email")
      .populate("members", "email")
      .populate("messages.sender", "email")
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    logger.error("Error fetching study groups:", error);
    res.status(500).json({ error: "Erreur lors du chargement des groupes" });
  }
});

// Create study group
router.post("/study-groups", auth, async (req, res) => {
  try {
    const { name, description, topic } = req.body;

    const group = new StudyGroup({
      name,
      description,
      topic,
      createdBy: req.user._id,
      members: [req.user._id],
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

// Update study group (creator or admin only)
router.put("/study-groups/:id", auth, async (req, res) => {
  try {
    const { name, description, topic } = req.body;
    const groupId = req.params.id;

    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Groupe non trouvé" });
    }

    // Check if user is creator or admin
    if (
      group.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    group.name = name;
    group.description = description;
    group.topic = topic;

    await group.save();
    await group.populate("createdBy", "email");
    await group.populate("members", "email");

    res.json(group);
  } catch (error) {
    logger.error("Error updating study group:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du groupe" });
  }
});

// Delete study group (creator or admin only)
router.delete("/study-groups/:id", auth, async (req, res) => {
  try {
    const groupId = req.params.id;

    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Groupe non trouvé" });
    }

    // Check if user is creator or admin
    if (
      group.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    await StudyGroup.findByIdAndDelete(groupId);
    res.json({ message: "Groupe supprimé avec succès" });
  } catch (error) {
    logger.error("Error deleting study group:", error);
    res.status(500).json({ error: "Erreur lors de la suppression du groupe" });
  }
});

// Join study group
router.post("/study-groups/:id/join", auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user._id;

    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Groupe non trouvé" });
    }

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    await group.populate("createdBy", "email");
    await group.populate("members", "email");
    await group.populate("messages.sender", "email");

    res.json(group);
  } catch (error) {
    logger.error("Error joining study group:", error);
    res.status(500).json({ error: "Erreur lors de l'adhésion au groupe" });
  }
});

// Leave study group
router.post("/study-groups/:id/leave", auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user._id;

    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Groupe non trouvé" });
    }

    // Remove user from members
    group.members.pull(userId);

    // If the creator leaves and there are other members, transfer ownership
    if (
      group.createdBy.toString() === userId.toString() &&
      group.members.length > 0
    ) {
      group.createdBy = group.members[0];
    }

    // If no members left, delete the group
    if (group.members.length === 0) {
      await StudyGroup.findByIdAndDelete(groupId);
      return res.json({ message: "Groupe supprimé (aucun membre restant)" });
    }

    await group.save();
    await group.populate("createdBy", "email");
    await group.populate("members", "email");

    res.json(group);
  } catch (error) {
    logger.error("Error leaving study group:", error);
    res.status(500).json({ error: "Erreur lors de la sortie du groupe" });
  }
});

// Add message to study group
router.post("/study-groups/:id/messages", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const groupId = req.params.id;

    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Groupe non trouvé" });
    }

    // Check if user is member
    if (!group.members.includes(req.user._id)) {
      return res
        .status(403)
        .json({ error: "Vous devez être membre du groupe" });
    }

    group.messages.push({
      sender: req.user._id,
      content,
    });

    await group.save();
    await group.populate("createdBy", "email");
    await group.populate("members", "email");
    await group.populate("messages.sender", "email");

    res.json(group);
  } catch (error) {
    logger.error("Error adding message:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
});

// Delete message (sender or group creator or admin only)
router.delete(
  "/study-groups/:groupId/messages/:messageId",
  auth,
  async (req, res) => {
    try {
      const { groupId, messageId } = req.params;

      const group = await StudyGroup.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: "Groupe non trouvé" });
      }

      const message = group.messages.id(messageId);
      if (!message) {
        return res.status(404).json({ error: "Message non trouvé" });
      }

      // Check if user is message sender, group creator, or admin
      const canDelete =
        message.sender.toString() === req.user._id.toString() ||
        group.createdBy.toString() === req.user._id.toString() ||
        req.user.role === "admin";

      if (!canDelete) {
        return res.status(403).json({ error: "Non autorisé" });
      }

      group.messages.pull(messageId);
      await group.save();
      await group.populate("createdBy", "email");
      await group.populate("members", "email");
      await group.populate("messages.sender", "email");

      res.json(group);
    } catch (error) {
      logger.error("Error deleting message:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression du message" });
    }
  }
);

// Schedule meeting for study group
router.post("/study-groups/:id/schedule", auth, async (req, res) => {
  try {
    const { date, duration, topic } = req.body;
    const groupId = req.params.id;

    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Groupe non trouvé" });
    }

    // Check if user is member
    if (!group.members.includes(req.user._id)) {
      return res
        .status(403)
        .json({ error: "Vous devez être membre du groupe" });
    }

    group.meetingSchedule = {
      date: new Date(date),
      duration,
      topic,
    };

    await group.save();
    await group.populate("createdBy", "email");
    await group.populate("members", "email");

    res.json(group);
  } catch (error) {
    logger.error("Error scheduling meeting:", error);
    res.status(500).json({ error: "Erreur lors de la planification" });
  }
});

// ==================== PEER REVIEW ====================

// Get all peer review submissions
router.get("/peer-review/submissions", auth, async (req, res) => {
  try {
    const submissions = await PeerReviewSubmission.find()
      .populate("author", "email")
      .populate("reviews.reviewer", "email")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    logger.error("Error fetching peer review submissions:", error);
    res
      .status(500)
      .json({ error: "Erreur lors du chargement des soumissions" });
  }
});

// Create peer review submission
router.post(
  "/peer-review/submissions",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, description } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "Fichier requis" });
      }

      const submission = new PeerReviewSubmission({
        title,
        description,
        fileUrl: `/uploads/${req.file.filename}`,
        fileName: req.file.originalname,
        author: req.user._id,
      });

      await submission.save();
      await submission.populate("author", "email");

      res.status(201).json(submission);
    } catch (error) {
      logger.error("Error creating peer review submission:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la création de la soumission" });
    }
  }
);

// Update peer review submission (author or admin only)
router.put("/peer-review/submissions/:id", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const submissionId = req.params.id;

    const submission = await PeerReviewSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: "Soumission non trouvée" });
    }

    // Check if user is author or admin
    if (
      submission.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    submission.title = title;
    submission.description = description;

    await submission.save();
    await submission.populate("author", "email");
    await submission.populate("reviews.reviewer", "email");

    res.json(submission);
  } catch (error) {
    logger.error("Error updating peer review submission:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la soumission" });
  }
});

// Delete peer review submission (author or admin only)
router.delete("/peer-review/submissions/:id", auth, async (req, res) => {
  try {
    const submissionId = req.params.id;

    const submission = await PeerReviewSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: "Soumission non trouvée" });
    }

    // Check if user is author or admin
    if (
      submission.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    // Delete associated file
    if (submission.fileUrl) {
      const filePath = path.join(__dirname, "../..", submission.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await PeerReviewSubmission.findByIdAndDelete(submissionId);
    res.json({ message: "Soumission supprimée avec succès" });
  } catch (error) {
    logger.error("Error deleting peer review submission:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la soumission" });
  }
});

// Add review to submission
router.post("/peer-review/submissions/:id/reviews", auth, async (req, res) => {
  try {
    const { content, rating } = req.body;
    const submissionId = req.params.id;

    const submission = await PeerReviewSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: "Soumission non trouvée" });
    }

    // Check if user is not the author
    if (submission.author.toString() === req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Vous ne pouvez pas réviser votre propre soumission" });
    }

    submission.reviews.push({
      reviewer: req.user._id,
      content,
      rating,
    });

    // Update status based on number of reviews
    if (submission.reviews.length >= 2) {
      submission.status = "completed";
    } else if (submission.reviews.length >= 1) {
      submission.status = "reviewed";
    }

    await submission.save();
    await submission.populate("author", "email");
    await submission.populate("reviews.reviewer", "email");

    res.json(submission);
  } catch (error) {
    logger.error("Error adding review:", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de la revue" });
  }
});

// Update review (reviewer or admin only)
router.put(
  "/peer-review/submissions/:submissionId/reviews/:reviewId",
  auth,
  async (req, res) => {
    try {
      const { content, rating } = req.body;
      const { submissionId, reviewId } = req.params;

      const submission = await PeerReviewSubmission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({ error: "Soumission non trouvée" });
      }

      const review = submission.reviews.id(reviewId);
      if (!review) {
        return res.status(404).json({ error: "Revue non trouvée" });
      }

      // Check if user is reviewer or admin
      if (
        review.reviewer.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ error: "Non autorisé" });
      }

      review.content = content;
      review.rating = rating;

      await submission.save();
      await submission.populate("author", "email");
      await submission.populate("reviews.reviewer", "email");

      res.json(submission);
    } catch (error) {
      logger.error("Error updating review:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la mise à jour de la revue" });
    }
  }
);

// Delete review (reviewer or admin only)
router.delete(
  "/peer-review/submissions/:submissionId/reviews/:reviewId",
  auth,
  async (req, res) => {
    try {
      const { submissionId, reviewId } = req.params;

      const submission = await PeerReviewSubmission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({ error: "Soumission non trouvée" });
      }

      const review = submission.reviews.id(reviewId);
      if (!review) {
        return res.status(404).json({ error: "Revue non trouvée" });
      }

      // Check if user is reviewer or admin
      if (
        review.reviewer.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ error: "Non autorisé" });
      }

      submission.reviews.pull(reviewId);

      // Update status based on remaining reviews
      if (submission.reviews.length === 0) {
        submission.status = "pending";
      } else if (submission.reviews.length === 1) {
        submission.status = "reviewed";
      }

      await submission.save();
      await submission.populate("author", "email");
      await submission.populate("reviews.reviewer", "email");

      res.json(submission);
    } catch (error) {
      logger.error("Error deleting review:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression de la revue" });
    }
  }
);

export const collaborationRoutes = router;
