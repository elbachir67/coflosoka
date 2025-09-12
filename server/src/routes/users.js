import express from "express";
import { body } from "express-validator";
import { User } from "../models/User.js";
import { LearnerProfile } from "../models/LearnerProfile.js";
import { auth, adminAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Get all users (admin only)
router.get("/", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    // Populate with profile data
    const usersWithProfiles = await Promise.all(
      users.map(async user => {
        const profile = await LearnerProfile.findOne({ userId: user._id });
        return {
          ...user.toObject(),
          profile: profile || null,
        };
      })
    );

    res.json(usersWithProfiles);
  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Get user by ID (admin only)
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = await LearnerProfile.findOne({ userId: user._id });

    res.json({
      ...user.toObject(),
      profile: profile || null,
    });
  } catch (error) {
    logger.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user" });
  }
});

// Register user
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
  ],
  validate,
  async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      const token = user.generateAuthToken();
      res.status(201).json({ user, token });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(400).json({ error: error.message });
    }
  }
);

// Login user
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").exists()],
  validate,
  async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user || !(await user.comparePassword(req.body.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = user.generateAuthToken();
      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get user profile
router.get("/profile", auth, async (req, res) => {
  res.json(req.user);
});

// Toggle user status (admin only)
router.put("/:id/toggle-status", adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    logger.info(
      `User ${user.email} status changed to ${
        isActive ? "active" : "inactive"
      } by admin ${req.user.email}`
    );

    res.json(user);
  } catch (error) {
    logger.error("Error updating user status:", error);
    res.status(500).json({ error: "Error updating user status" });
  }
});

// Update user role (admin only)
router.put("/:id/role", adminAuth, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    logger.info(
      `User ${user.email} role changed to ${role} by admin ${req.user.email}`
    );

    res.json(user);
  } catch (error) {
    logger.error("Error updating user role:", error);
    res.status(500).json({ error: "Error updating user role" });
  }
});

// Delete user (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Also delete associated profile
    await LearnerProfile.deleteOne({ userId: req.params.id });

    logger.info(`User ${user.email} deleted by admin ${req.user.email}`);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
});

// Update user progress
router.post("/progress/:stepId", auth, async (req, res) => {
  try {
    const user = req.user;
    const stepId = req.params.stepId;

    const progressIndex = user.progress.findIndex(
      p => p.step.toString() === stepId
    );

    if (progressIndex > -1) {
      user.progress[progressIndex].completed = true;
      user.progress[progressIndex].completedAt = new Date();
    } else {
      user.progress.push({
        step: stepId,
        completed: true,
        completedAt: new Date(),
      });
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user statistics (admin only)
router.get("/stats/overview", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: "admin" });
    const newUsersThisWeek = await User.countDocuments({
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    const stats = {
      totalUsers,
      activeUsers,
      adminUsers,
      newUsersThisWeek,
      inactiveUsers: totalUsers - activeUsers,
    };

    res.json(stats);
  } catch (error) {
    logger.error("Error fetching user statistics:", error);
    res.status(500).json({ error: "Error fetching statistics" });
  }
});

export const userRoutes = router;
