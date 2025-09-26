import Joi from "joi";

export const register = {
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const login = {
  username: Joi.string().required(),
  password: Joi.string().required(),
};

export const profileEdit = {
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
};
