import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        type: {
          type: String,
          enum: ['sell', 'rent'],
          required: true,
        },
      },
    ],
    type: {
      type: String,
      enum: ["purchase", "rental"],
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "completed",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: [
        "card",
        "credit_card",
        "debit_card",
        "paypal",
        "bank_transfer",
        "cash_on_delivery",
        "upi",
        "wallet",
        "net_banking",
      ],
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    deliveryDate: {
      type: Date,
    },
    returnDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderType: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
