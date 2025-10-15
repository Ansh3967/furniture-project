import Item from "../../../models/item.model.js";
import Review from "../../../models/review.model.js";
import mongoose from "mongoose";

// List all items with filtering and pagination
export const list = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      availability = "available",
      saleType,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      minPrice,
      maxPrice,
      condition,
      isFeatured,
    } = req.query;

    const filter = { availability: "available" }; // Only show available items to users

    if (category) filter.category = category;
    if (saleType) filter.saleType = saleType;
    if (condition) filter.condition = condition;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Price filtering
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);

      filter.$or = [{ price: priceFilter }, { rentPrice: priceFilter }];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const items = await Item.find(filter)
      .populate("category", "name description")
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

    // Only show available items to users
    if (item.availability !== "available") {
      return res.status(404).json({ message: "Item not available" });
    }

    // Increment view count
    await Item.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    // Get reviews for this item
    let reviews = [];
    let avgRating = 0;
    let reviewCount = 0;
    try {
      reviews = await Review.find({ itemId: id })
        .populate("userId", "firstName lastName")
        .sort({ createdAt: -1 });
      reviewCount = reviews.length;
      if (reviewCount > 0) {
        const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        avgRating = Math.round((total / reviewCount) * 10) / 10;
      }
    } catch (reviewErr) {
      reviews = [];
    }

    res.json({ item, reviews, avgRating, reviewCount });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
