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
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    availability: {
      type: String,
      enum: ["available", "out_of_stock", "discontinued"],
      required: true,
      default: "available",
    },
    saleType: {
      type: String,
      enum: ["sale", "rent", "both"],
      required: true,
      default: "sale",
    },
    price: {
      type: Number,
      required: function () {
        return this.saleType === "sale" || this.saleType === "both";
      },
      min: 0,
    },
    rentPrice: {
      type: Number,
      required: function () {
        return this.saleType === "rent" || this.saleType === "both";
      },
      min: 0,
    },
    depositPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: [String],
    specifications: {
      dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
        unit: { type: String, default: "cm" },
      },
      weight: {
        value: { type: Number },
        unit: { type: String, default: "kg" },
      },
      material: { type: String },
      color: { type: String },
      brand: { type: String },
    },
    features: [String],
    warranty: {
      type: String,
      trim: true,
    },
    condition: {
      type: String,
      enum: ["new", "like_new", "good", "fair"],
      default: "new",
    },
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
