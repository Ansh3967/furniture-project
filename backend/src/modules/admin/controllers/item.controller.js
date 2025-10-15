import Item from "../../../models/item.model.js";
import Category from "../../../models/category.model.js";
import mongoose from "mongoose";

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
      .populate("images", "url altText")
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

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
      itemData.images = imageUrls;
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
      .populate("images", "url altText");

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

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = imageUrls;
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
