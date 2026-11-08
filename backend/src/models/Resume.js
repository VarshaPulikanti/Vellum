import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled resume" },
    template: {
      type: String,
      enum: ["editorial", "minimal", "technical"],
      default: "editorial",
    },
    accent: { type: String, default: "#2c4a40" },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

resumeSchema.index({ user: 1, updatedAt: -1 });

export const Resume = mongoose.model("Resume", resumeSchema);
