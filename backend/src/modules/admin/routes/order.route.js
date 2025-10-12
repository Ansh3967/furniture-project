import { Router } from "express";
import * as controller from "../controllers/order.controller.js";
import * as validation from "../validation/order.validation.js";
import validate from "../../../middlewares/validate.js";

const orderRouter = Router();

// Get all orders with filtering and pagination
orderRouter.get("/", validate(validation.getOrders), controller.getOrders);

// Get order by ID
orderRouter.get(
  "/:id",
  validate(validation.getOrderById),
  controller.getOrderById
);

// Update order status
orderRouter.patch(
  "/:id/status",
  validate(validation.updateOrderStatus),
  controller.updateOrderStatus
);

// Update order payment status
orderRouter.patch(
  "/:id/payment",
  validate(validation.updatePaymentStatus),
  controller.updatePaymentStatus
);

// Add tracking number
orderRouter.patch(
  "/:id/tracking",
  validate(validation.addTrackingNumber),
  controller.addTrackingNumber
);

// Get order statistics
orderRouter.get("/stats/overview", controller.getOrderStats);

// Get orders by status
orderRouter.get(
  "/status/:status",
  validate(validation.getOrdersByStatus),
  controller.getOrdersByStatus
);

export default orderRouter;
