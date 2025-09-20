import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
      maxlength: 10,
    },
    name: {
      type: String,
      required: true,
      maxlength: 25,
    },
    color: {
      type: String,
      required: true,
      maxlength: 25,
    },
    buy_price: {
      type: Number, // was VARCHAR in SQL, but better as Number
      default: null,
    },
    rent_price: {
      type: Number, // CHAR(10) → Number
      default: null,
    },
    deposit_price: {
      type: Number, // CHAR(10) → Number
      default: null,
    },
  },
  { timestamps: true }
);

export const Item = mongoose.model("Item", itemSchema);
