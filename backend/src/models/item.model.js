import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    furnitureStatus: {
      type: String,
      enum: ["in stock", "out of stock"],
      required: true,
      default: "in stock",
    },
    // New field: saleType (for sale, rent, or both)
    saleType: {
      type: String,
      enum: ["sale", "rent", "both"],
      required: true,
      default: "sale",
    },
    buyPrice: {
      type: Number,
      required: false,
      default: null,
    },
    rentPrice: {
      type: Number,
      required: false,
      default: null,
    },
    depositPrice: {
      type: Number,
      required: false,
      default: null,
    },
    // New field: warranty
    warranty: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    mediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
