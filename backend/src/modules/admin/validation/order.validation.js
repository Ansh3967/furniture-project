import Joi from "joi";

export const getOrders = {
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "completed",
      "cancelled",
      "returned"
    )
    .optional(),
  orderType: Joi.string().valid("purchase", "rental", "mixed").optional(),
  paymentStatus: Joi.string()
    .valid("pending", "paid", "failed", "refunded")
    .optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  search: Joi.string().optional(),
};

export const getOrderById = {
  id: Joi.string().hex().length(24).required(),
};

export const updateOrderStatus = {
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "completed",
      "cancelled",
      "returned"
    )
    .required(),
  notes: Joi.string().optional(),
};

export const updatePaymentStatus = {
  paymentStatus: Joi.string()
    .valid("pending", "paid", "failed", "refunded")
    .required(),
};

export const addTrackingNumber = {
  trackingNumber: Joi.string().required(),
};

export const getOrdersByStatus = {
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "completed",
      "cancelled",
      "returned"
    )
    .required(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
};
