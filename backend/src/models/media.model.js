import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    altText: {
      type: String,
      trim: true,
      default: "",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    metadata: {
      width: Number,
      height: Number,
      format: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
mediaSchema.index({ uploadedBy: 1, createdAt: -1 });
mediaSchema.index({ isActive: 1 });
mediaSchema.index({ mimeType: 1 });

const Media = mongoose.model("Media", mediaSchema);

export default Media;