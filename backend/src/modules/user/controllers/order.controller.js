import Order from "../../../models/order.model.js";
import Item from "../../../models/item.model.js";
import mongoose from "mongoose";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, total, type, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    // Validate items
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Order must contain at least one item" });
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    // Create order items with item details
    const orderItems = items.map((item) => ({
      item: item.furnitureId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      type: item.type,
    }));

    // Create order with all fields including paymentMethod
    const order = new Order({
      orderNumber,
      user: userId,
      items: orderItems,
      total,
      type,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod,
      shippingAddress,
      notes: `Order placed via ${paymentMethod}`,
    });

    await order.save();

    // Populate the order with user and item details
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "firstName lastName email phone")
      .populate("items.item", "name price rentPrice images");

    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const filter = { user: userId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate("items.item", "name price rentPrice images")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findOne({ _id: id, user: userId }).populate(
      "items.item",
      "name price rentPrice images specifications"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findOne({ _id: id, user: userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow cancellation if order is pending or confirmed
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.status = "cancelled";
    order.notes = order.notes
      ? `${order.notes}\nCancelled by user`
      : "Cancelled by user";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
