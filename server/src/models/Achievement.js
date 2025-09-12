import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["learning", "engagement", "milestone", "special"],
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
    },
    criteria: {
      type: {
        type: String,
        enum: [
          "complete_modules",
          "complete_pathways",
          "quiz_score",
          "streak_days",
          "resources_completed",
          "time_spent",
          "special_event",
        ],
        required: true,
      },
      threshold: {
        type: Number,
        required: true,
      },
      additionalParams: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
      },
    },
    rarity: {
      type: String,
      enum: ["common", "uncommon", "rare", "epic", "legendary"],
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    badgeUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index({ category: 1, rarity: 1 });
achievementSchema.index({ "criteria.type": 1 });

export const Achievement = mongoose.model("Achievement", achievementSchema);
