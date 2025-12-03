import Item from "../../../models/item.model.js";
import Category from "../../../models/category.model.js";
import Media from "../../../models/media.model.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// List all items with filtering and pagination
export const list = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      availability,
      saleType,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (availability) filter.availability = availability;
    if (saleType) filter.saleType = saleType;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const items = await Item.find(filter)
      .populate("category", "name")
      .populate("images", "url altText filename originalName mimeType")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Item.countDocuments(filter);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single item by ID
export const get = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const item = await Item.findById(id)
      .populate("category", "name description")
      .populate("images", "url altText");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Increment view count
    await Item.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a new item
export const add = async (req, res) => {
  try {
    const itemData = req.body;
    const adminId = req.admin._id;

    // Handle uploaded images - create media records
    if (req.files && req.files.length > 0) {
      const mediaIds = [];

      for (const file of req.files) {
        // Create media record for each uploaded file
        const mediaData = {
          filename: file.filename,
          originalName: file.originalname,
          url: `http://localhost:${process.env.PORT || 5000}/uploads/${file.filename}`,
          mimeType: file.mimetype,
          size: file.size,
          uploadedBy: adminId,
          altText: req.body.altText || "",
          tags: req.body.tags
            ? (typeof req.body.tags === 'string' ? req.body.tags.split(",").map((tag) => tag.trim()) : req.body.tags)
            : [],
        };

        // Add image metadata if it's an image
        if (file.mimetype.startsWith("image/")) {
          mediaData.metadata = {
            format: file.mimetype.split("/")[1],
          };
        }

        const media = new Media(mediaData);
        await media.save();
        mediaIds.push(media._id);
      }

      itemData.images = mediaIds;
      console.log(`Created ${mediaIds.length} media records for item`);
    } else {
      console.log("No files uploaded");
    }

    // Validate category exists
    if (itemData.category) {
      const category = await Category.findById(itemData.category);
      if (!category) {
        return res.status(400).json({ message: "Category not found" });
      }
    }

    const newItem = new Item(itemData);
    await newItem.save();

    const populatedItem = await Item.findById(newItem._id)
      .populate("category", "name")
      .populate("images", "url altText filename originalName mimeType");

    res.status(201).json({
      message: "Item created successfully",
      item: populatedItem,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Edit an existing item
export const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const adminId = req.admin._id;

    // Get existing item to access old images
    const existingItem = await Item.findById(id).select("images");
    const oldImageIds = existingItem?.images || [];

    // Handle uploaded images - create media records
    if (req.files && req.files.length > 0) {
      const mediaIds = [];

      for (const file of req.files) {
        // Create media record for each uploaded file
        const mediaData = {
          filename: file.filename,
          originalName: file.originalname,
          url: `http://localhost:${process.env.PORT || 5000}/uploads/${file.filename}`,
          mimeType: file.mimetype,
          size: file.size,
          uploadedBy: adminId,
          altText: req.body.altText || "",
          tags: req.body.tags
            ? (typeof req.body.tags === 'string' ? req.body.tags.split(",").map((tag) => tag.trim()) : req.body.tags)
            : [],
        };

        // Add image metadata if it's an image
        if (file.mimetype.startsWith("image/")) {
          mediaData.metadata = {
            format: file.mimetype.split("/")[1],
          };
        }

        const media = new Media(mediaData);
        await media.save();
        mediaIds.push(media._id);
      }

      // Replace old images with new ones
      updateData.images = mediaIds;
      console.log(`Replaced ${oldImageIds.length} old images with ${mediaIds.length} new images`);

      // Delete old media files and records
      if (oldImageIds.length > 0) {
        for (const oldImageId of oldImageIds) {
          try {
            const oldMedia = await Media.findById(oldImageId);
            if (oldMedia) {
              // Delete file from filesystem
              const filePath = path.join(process.cwd(), "uploads", oldMedia.filename);
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Deleted old file: ${oldMedia.filename}`);
              }
              // Delete media record from database
              await Media.findByIdAndDelete(oldImageId);
              console.log(`Deleted old media record: ${oldImageId}`);
            }
          } catch (error) {
            console.error(`Error deleting old media ${oldImageId}:`, error.message);
            // Continue with other deletions even if one fails
          }
        }
      }
    } else {
      // If no new files, keep existing images
      if (!updateData.images) {
        updateData.images = oldImageIds;
      }
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    // Validate category exists if being updated
    if (updateData.category) {
      const category = await Category.findById(updateData.category);
      if (!category) {
        return res.status(400).json({ message: "Category not found" });
      }
    }

    const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name")
      .populate("images", "url altText");

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove an item
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Toggle item featured status
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.isFeatured = !item.isFeatured;
    await item.save();

    res.json({
      message: `Item ${
        item.isFeatured ? "featured" : "unfeatured"
      } successfully`,
      item,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get item statistics
export const getStats = async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const availableItems = await Item.countDocuments({
      availability: "available",
    });
    const outOfStockItems = await Item.countDocuments({
      availability: "out_of_stock",
    });
    const featuredItems = await Item.countDocuments({ isFeatured: true });

    const itemsByType = await Item.aggregate([
      { $group: { _id: "$saleType", count: { $sum: 1 } } },
    ]);

    const itemsByCategory = await Item.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      { $project: { categoryName: "$categoryInfo.name", count: 1 } },
    ]);

    const topViewedItems = await Item.find()
      .sort({ viewCount: -1 })
      .limit(5)
      .populate("category", "name")
      .select("name viewCount category");

    res.json({
      totalItems,
      availableItems,
      outOfStockItems,
      featuredItems,
      itemsByType,
      itemsByCategory,
      topViewedItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
