import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Media = mongoose.model("Media", mediaSchema);

export default Media;
