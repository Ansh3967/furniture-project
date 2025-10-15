import Joi from "joi";

export const uploadMedia = {
  body: Joi.object({
    altText: Joi.string().allow(""),
    tags: Joi.string().allow(""),
  }),
};

export const getAllMedia = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    type: Joi.string().valid("image", "video", "document"),
    search: Joi.string().allow(""),
  }),
};

export const getMediaById = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

export const updateMedia = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    altText: Joi.string().allow(""),
    tags: Joi.alternatives().try(
      Joi.string().allow(""),
      Joi.array().items(Joi.string())
    ),
  }),
};

export const deleteMedia = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};
