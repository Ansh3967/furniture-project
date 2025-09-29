import Joi from "joi";

// Validation for adding a review
export const add = {
  itemId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().trim().allow(""),
};

// Validation for editing a review
export const edit = {
  id: Joi.string().required(),
  rating: Joi.number().min(1).max(5),
  comment: Joi.string().trim().allow(""),
};
