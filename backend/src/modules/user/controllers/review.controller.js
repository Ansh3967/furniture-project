import Review from "../../../models/review.model.js";
import mongoose from "mongoose";

// Add a new review
export const add = async (req, res) => {
  try {
    const user = req.user;
    const requestData = req.body;
    requestData.userId = user.id;

    const newReview = new Review(requestData);

    await newReview.save();
    res.status(201).json({ message: "Review added", review: newReview });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Edit an existing review
export const edit = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ error: "Failed to update review" });
  }
};

// List reviews for an item
export const listForItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    const reviews = await Review.find({ itemId })
      .populate("userId", "firstName lastName")
      .sort({ createdAt: -1 });
    const count = reviews.length;
    const avg = count
      ? Math.round(
          (reviews.reduce((s, r) => s + (r.rating || 0), 0) / count) * 10
        ) / 10
      : 0;
    res.json({ reviews, avgRating: avg, reviewCount: count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
