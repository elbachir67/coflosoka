import mongoose from "mongoose";

const sharedResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["article", "video", "course", "book", "use_case", "other"],
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downloads: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
sharedResourceSchema.index({ author: 1 });
sharedResourceSchema.index({ type: 1 });
sharedResourceSchema.index({ tags: 1 });
sharedResourceSchema.index({ isActive: 1 });
sharedResourceSchema.index({ createdAt: -1 });

export const SharedResource = mongoose.model(
  "SharedResource",
  sharedResourceSchema
);
