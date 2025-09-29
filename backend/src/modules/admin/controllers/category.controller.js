import Category from "../../../models/category.model.js";

// List all categories
export const list = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Add a new category
export const add = async (req, res) => {
  try {
    const requestData = req.body;

    const newCategory = new Category(requestData);

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Edit an existing category
export const edit = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: "Failed to update category" });
  }
};

// Remove a category
export const remove = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};
