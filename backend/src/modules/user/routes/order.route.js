import express from "express";
import { authenticateUser } from "../../../middlewares/auth.js";
import validate from "../../../middlewares/validate.js";
import * as validation from "../validation/order.validation.js";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder
} from "../controllers/order.controller.js";

const router = express.Router();

// All routes require user authentication
router.use(authenticateUser);

// Create order
router.post("/", validate(validation.createOrder), createOrder);

// Get user's orders
router.get("/", validate(validation.getUserOrders), getUserOrders);

// Get order by ID
router.get("/:id", validate(validation.getOrderById), getOrderById);

// Cancel order
router.patch("/:id/cancel", validate(validation.cancelOrder), cancelOrder);

export default router;