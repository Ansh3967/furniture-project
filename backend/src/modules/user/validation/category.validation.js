import Joi from "joi";

export const list = {};

export const get = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};
