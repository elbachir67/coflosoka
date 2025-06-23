import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const peerReviewSubmissionSchema = new mongoose.Schema(
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
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "completed"],
      default: "pending",
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes
peerReviewSubmissionSchema.index({ author: 1 });
peerReviewSubmissionSchema.index({ status: 1 });
peerReviewSubmissionSchema.index({ createdAt: -1 });

export const PeerReviewSubmission = mongoose.model(
  "PeerReviewSubmission",
  peerReviewSubmissionSchema
);
