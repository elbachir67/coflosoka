import mongoose from "mongoose";

const userAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Achievement",
      required: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isViewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
userAchievementSchema.index({ userId: 1, isCompleted: 1 });
userAchievementSchema.index({ userId: 1, isViewed: 1 });

export const UserAchievement = mongoose.model(
  "UserAchievement",
  userAchievementSchema
);
