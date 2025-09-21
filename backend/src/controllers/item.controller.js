import Item from "../models/item.model.js";
import multer from "../services/multerService.js";

// List all items
export const list = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

// Get a single item by ID
export const get = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch item" });
  }
};

// Add a new item
export const add = [
  multer.single("file"),
  async (req, res) => {
    try {
      const requestData = req.body;

      const newItem = new Item(requestData);

      await newItem.save();
      res.status(201).json(newItem);
    } catch (err) {
      res.status(500).json({ error: "Failed to add item" });
    }
  },
];

// Edit an existing item
export const edit = [
  multer.single("file"),
  async (req, res) => {
    try {
      const { name, description, price } = req.body;
      const updateData = { name, description, price };

      if (req.file) {
        updateData.file = req.file.filename;
      }

      const updatedItem = await Item.findByIdAndUpdate(
        req.params.itemId,
        updateData,
        { new: true }
      );

      if (!updatedItem) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json(updatedItem);
    } catch (err) {
      res.status(500).json({ error: "Failed to update item" });
    }
  },
];

// Remove an item
export const remove = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.itemId);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
};
