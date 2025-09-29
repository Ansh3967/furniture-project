import Joi from "joi";

export const add = {
  name: Joi.string().trim().required(),
};

export const edit = {
  id: Joi.string().required(),
  name: Joi.string().trim().optional(),
};

export const list = {};

export const remove = {
  id: Joi.string().required(),
};
