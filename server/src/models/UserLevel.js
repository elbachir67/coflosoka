import mongoose from "mongoose";

const userLevelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    level: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    currentXP: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    requiredXP: {
      type: Number,
      required: true,
      default: 100,
      min: 1,
    },
    totalXP: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    streakDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActivityDate: {
      type: Date,
      default: Date.now,
    },
    badges: [
      {
        name: String,
        icon: String,
        unlockedAt: Date,
      },
    ],
    rank: {
      type: String,
      enum: [
        "Novice",
        "Apprenti",
        "Étudiant",
        "Chercheur",
        "Expert",
        "Maître",
        "Grand Maître",
        "Visionnaire",
      ],
      default: "Novice",
    },
  },
  {
    timestamps: true,
  }
);

// Define indexes with explicit names to avoid conflicts
userLevelSchema.index({ userId: 1 }, { name: "userLevel_userId_index" });
userLevelSchema.index({ level: 1 }, { name: "userLevel_level_index" });
userLevelSchema.index({ totalXP: 1 }, { name: "userLevel_totalXP_index" });

export const UserLevel = mongoose.model("UserLevel", userLevelSchema);
