import Category from "../../../models/category.model.js";
import mongoose from "mongoose";

// List all categories (public)
export const list = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({
      categories,
      total: categories.length,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch categories", error: err.message });
  }
};

// Get category by ID (public)
export const get = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch category", error: err.message });
  }
};
