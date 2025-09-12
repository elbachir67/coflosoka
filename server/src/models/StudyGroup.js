import mongoose from "mongoose";

const meetingScheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 15,
    max: 180,
  },
  topic: {
    type: String,
    required: true,
  },
});

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const studyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [messageSchema],
    meetingSchedule: meetingScheduleSchema,
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
studyGroupSchema.index({ createdBy: 1 });
studyGroupSchema.index({ members: 1 });
studyGroupSchema.index({ topic: 1 });
studyGroupSchema.index({ isActive: 1 });

export const StudyGroup = mongoose.model("StudyGroup", studyGroupSchema);
