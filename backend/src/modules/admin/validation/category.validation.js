import Joi from "joi";

export const add = {
  body: Joi.object({
    name: Joi.string().trim().required(),
  }),
};

export const edit = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().required(),
  }),
};

export const list = {};

export const get = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

export const remove = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};
