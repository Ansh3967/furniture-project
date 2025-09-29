import Review from "../../../models/review.model.js";

// Add a new review
export const add = async (req, res) => {
  try {
    const user = req.user;
    const requestData = req.body;
    requestData.userId = user.id;

    const newReview = new Review(requestData);

    await newReview.save();
    res.status(201).json(newReview);
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
