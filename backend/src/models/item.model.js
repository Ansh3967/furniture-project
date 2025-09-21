import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
    },
    name: {
      type: String,
      required: false,
      maxlength: [25, "Name cannot exceed 25 characters"],
      trim: true,
      description: "Name of the item"
    },
    color: {
      type: String,
      required: false,
      maxlength: [25, "Color cannot exceed 25 characters"],
      trim: true,
      description: "Color of the item"
    },
    buyPrice: {
      type: Number,
      required: false,
      min: [0, "Buy price cannot be negative"],
      default: null,
      description: "Price to buy the item"
    },
    rentPrice: {
      type: Number,
      required: false,
      min: [0, "Rent price cannot be negative"],
      default: null,
      description: "Price to rent the item"
    },
    depositPrice: {
      type: Number,
      required: false,
      min: [0, "Deposit price cannot be negative"],
      default: null,
      description: "Deposit required for the item"
    }
  },
  {
    timestamps: true,
    collection: "items"
  }
);

export default mongoose.model("Item", itemSchema);
