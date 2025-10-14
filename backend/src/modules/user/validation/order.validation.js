import Joi from "joi";

export const createOrder = {
  body: Joi.object({
    items: Joi.array().items(
      Joi.object({
        furnitureId: Joi.string().required(),
        name: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().min(0).required(),
        type: Joi.string().valid('sell', 'rent').required()
      })
    ).min(1).required(),
    total: Joi.number().min(0).required(),
    type: Joi.string().valid('purchase', 'rental').required(),
    shippingAddress: Joi.string().required(),
    paymentMethod: Joi.string().required()
  })
};

export const getUserOrders = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
  })
};

export const getOrderById = {
  params: Joi.object({
    id: Joi.string().required()
  })
};

export const cancelOrder = {
  params: Joi.object({
    id: Joi.string().required()
  })
};
