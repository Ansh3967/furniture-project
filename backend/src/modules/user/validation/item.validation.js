import Joi from "joi";

export const add = {
  name: Joi.string().trim().required(),
  description: Joi.string().trim().allow(null, ""),
  categoryId: Joi.string().required(),
  furnitureStatus: Joi.string().valid("in stock", "out of stock").required(),
  saleType: Joi.string().valid("sale", "rent", "both").required(),
  buyPrice: Joi.number().allow(null),
  rentPrice: Joi.number().allow(null),
  depositPrice: Joi.number().allow(null),
  warranty: Joi.string().trim().allow(null, ""),
  mediaId: Joi.string().allow(null),
};

export const edit = {
  id: Joi.string().required(),
  name: Joi.string().trim(),
  description: Joi.string().trim().allow(null, ""),
  categoryId: Joi.string(),
  furnitureStatus: Joi.string().valid("in stock", "out of stock"),
  saleType: Joi.string().valid("sale", "rent", "both"),
  buyPrice: Joi.number().allow(null),
  rentPrice: Joi.number().allow(null),
  depositPrice: Joi.number().allow(null),
  warranty: Joi.string().trim().allow(null, ""),
  mediaId: Joi.string().allow(null),
};

export const list = {};

export const get = {
  id: Joi.string().required(),
};

export const remove = {
  id: Joi.string().required(),
};
