import { Router } from "express";
import Item from "../models/item.model.js";

const itemRouter = Router();
// Add a route to get all items
itemRouter.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// Add a route to get a single item by itemId
itemRouter.get("/:itemId", async (req, res) => {
  try {
    const item = await Item.findOne({ itemId: req.params.itemId });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch item" });
  }
});



// Add a route to add a new item (with request body)
itemRouter.post("/add", async (req, res) => {
  const requestData = req.body;
  // Only allow requests with exactly { "itemId": "...", "name": "..." }
  if (
    !requestData ||
    typeof requestData !== "object" ||
    Array.isArray(requestData) ||
    Object.keys(requestData).length !== 2 ||
    !("itemId" in requestData) ||
    !("name" in requestData)
  ) {
    return res.status(400).json({ error: "itemId is required" });
  }
  try {
    const item = new Item(requestData);
    await item.save();
    res.status(201).json({ message: "Item created", item });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(409).json({ error: "Item ID already exists" });
    }
    res.status(400).json({ error: err.message });
  }
});

// Add a route to update an item by itemId
itemRouter.put("/:itemId", async (req, res) => {
  try {
    const updatedItem = await Item.findOneAndUpdate(
      { itemId: req.params.itemId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item updated", item: updatedItem });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a route to delete an item by itemId
itemRouter.delete("/:itemId", async (req, res) => {
  try {
    const deletedItem = await Item.findOneAndDelete({ itemId: req.params.itemId });
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

export default itemRouter;
