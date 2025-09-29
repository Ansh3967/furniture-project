import Item from "../../../models/item.model.js";

// List all items
export const list = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

import Review from "../../../models/review.model.js";

export const get = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(200).json({ item: null, reviews: [] });
    }
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    let reviews = [];
    try {
      reviews = await Review.find({ itemId: id });
    } catch (reviewErr) {
      reviews = [];
    }
    res.json({ item, reviews });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch item" });
  }
};

// Add a new item
export const add = async (req, res) => {
  try {
    const requestData = req.body;

    const newItem = new Item(requestData);

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Edit an existing item
export const edit = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
};

// Remove an item
export const remove = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
};
