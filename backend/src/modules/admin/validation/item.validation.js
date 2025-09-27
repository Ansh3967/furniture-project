import Joi from "joi";

export const add = {
  name: Joi.string().trim().required(),
  color: Joi.string().trim().required(),
  buyPrice: Joi.number().allow(null),
  rentPrice: Joi.number().allow(null),
  depositPrice: Joi.number().allow(null),
};

export const edit = {
  id: Joi.string().required(),
  name: Joi.string().trim(),
  color: Joi.string().trim(),
  buyPrice: Joi.number().allow(null),
  rentPrice: Joi.number().allow(null),
  depositPrice: Joi.number().allow(null),
};

export const list = {};

export const get = {
  id: Joi.string().required(),
};

export const remove = {
  id: Joi.string().required(),
};
