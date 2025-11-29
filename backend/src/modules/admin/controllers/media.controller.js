import Media from "../../../models/media.model.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// Upload media files
export const uploadMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedMedia = [];
    const adminId = req.admin._id;

    for (const file of req.files) {
      // Create media record
      const mediaData = {
        filename: file.filename,
        originalName: file.originalname,
        url: `http://localhost:${process.env.PORT}/uploads/${file.filename}`,
        mimeType: file.mimetype,
        size: file.size,
        uploadedBy: adminId,
        altText: req.body.altText || "",
        tags: req.body.tags
          ? req.body.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      // Add image metadata if it's an image
      if (file.mimetype.startsWith("image/")) {
        // You can add image processing here to get dimensions
        mediaData.metadata = {
          format: file.mimetype.split("/")[1],
        };
      }

      const media = new Media(mediaData);
      await media.save();
      uploadedMedia.push(media);
    }

    res.status(201).json({
      message: "Media uploaded successfully",
      media: uploadedMedia,
    });
  } catch (error) {
    console.error("Media upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all media
export const getAllMedia = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, search } = req.query;
    const filter = { isActive: true };

    if (type) {
      filter.mimeType = { $regex: `^${type}/`, $options: "i" };
    }

    if (search) {
      filter.$or = [
        { originalName: { $regex: search, $options: "i" } },
        { altText: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const media = await Media.find(filter)
      .populate("uploadedBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Media.countDocuments(filter);

    res.json({
      media,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single media
export const getMediaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid media ID" });
    }

    const media = await Media.findById(id).populate(
      "uploadedBy",
      "firstName lastName email"
    );

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    res.json(media);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update media
export const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { altText, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid media ID" });
    }

    const updateData = {};
    if (altText !== undefined) updateData.altText = altText;
    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag) => tag.trim());
    }

    const media = await Media.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("uploadedBy", "firstName lastName email");

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    res.json({
      message: "Media updated successfully",
      media,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete media
export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid media ID" });
    }

    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), "uploads", media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await Media.findByIdAndDelete(id);

    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get media statistics
export const getMediaStats = async (req, res) => {
  try {
    const totalMedia = await Media.countDocuments({ isActive: true });
    const imageCount = await Media.countDocuments({
      isActive: true,
      mimeType: { $regex: "^image/" },
    });
    const videoCount = await Media.countDocuments({
      isActive: true,
      mimeType: { $regex: "^video/" },
    });
    const documentCount = await Media.countDocuments({
      isActive: true,
      mimeType: { $regex: "^(application|text)/" },
    });

    const totalSize = await Media.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalSize: { $sum: "$size" } } },
    ]);

    res.json({
      totalMedia,
      imageCount,
      videoCount,
      documentCount,
      totalSize: totalSize[0]?.totalSize || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
