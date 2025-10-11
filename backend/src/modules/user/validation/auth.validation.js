import Joi from "joi";

export const register = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phone: Joi.string().required(),
};

export const login = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const profile = {};

export const profileEdit = {
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  password: Joi.string(),
};