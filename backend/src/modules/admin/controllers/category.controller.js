import Category from "../../../models/category.model.js";
import mongoose from "mongoose";

// List all categories
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

// Get category by ID
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

// Add a new category
export const add = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res
      .status(500)
      .json({ message: "Failed to create category", error: err.message });
  }
};

// Edit an existing category
export const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Check if category already exists (excluding current category)
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne: id },
    });
    if (existingCategory) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res
      .status(500)
      .json({ message: "Failed to update category", error: err.message });
  }
};

// Remove a category
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete category", error: err.message });
  }
};
