import Joi from "joi";

export const list = {
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  role: Joi.string().valid("user", "admin").optional(),
  isActive: Joi.boolean().optional(),
  search: Joi.string().optional(),
  sortBy: Joi.string()
    .valid("firstName", "lastName", "email", "createdAt", "lastLogin")
    .optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
};

export const get = {
  id: Joi.string().hex().length(24).required(),
};

export const update = {
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().allow("").optional(),
  role: Joi.string().valid("user", "admin").optional(),
  isActive: Joi.boolean().optional(),
};

export const remove = {
  id: Joi.string().hex().length(24).required(),
};

export const toggleStatus = {
  id: Joi.string().hex().length(24).required(),
};
