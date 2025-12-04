import Joi from "joi";

export const list = {
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(50).optional(),
  category: Joi.string().hex().length(24).optional(),
  availability: Joi.string()
    .valid("available", "out_of_stock", "discontinued")
    .optional(),
  saleType: Joi.string().valid("sale", "rent", "both").optional(),
  search: Joi.string().optional(),
  sortBy: Joi.string()
    .valid("name", "price", "createdAt", "viewCount")
    .optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  condition: Joi.string().valid("new", "like_new", "good", "fair").optional(),
  isFeatured: Joi.boolean().optional(),
};

export const get = {
  id: Joi.string().hex().length(24).required(),
};

export const add = {
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  category: Joi.string().hex().length(24).required(),
  availability: Joi.string()
    .valid("available", "out_of_stock", "discontinued")
    .default("available"),
  saleType: Joi.string().valid("sale", "rent", "both").required(),
  price: Joi.number()
    .min(0)
    .when("saleType", {
      is: Joi.string().valid("sale", "both"),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  rentPrice: Joi.number()
    .min(0)
    .when("saleType", {
      is: Joi.string().valid("rent", "both"),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  depositPrice: Joi.number().min(0).default(0),
  images: Joi.array().items(Joi.string().hex().length(24)).default([]),
  specifications: Joi.object({
    dimensions: Joi.object({
      length: Joi.number(),
      width: Joi.number(),
      height: Joi.number(),
      unit: Joi.string().default("cm"),
    }),
    weight: Joi.object({
      value: Joi.number(),
      unit: Joi.string().default("kg"),
    }),
    material: Joi.string(),
    color: Joi.string(),
    brand: Joi.string(),
  }),
  features: Joi.array().items(Joi.string()),
  warranty: Joi.string().trim(),
  condition: Joi.string()
    .valid("new", "like_new", "good", "fair")
    .default("new"),
  tags: Joi.array().items(Joi.string()),
  isFeatured: Joi.boolean().default(false),
  quantity: Joi.number().integer().min(0).default(0),
};

export const edit = {
  name: Joi.string().trim(),
  description: Joi.string().trim(),
  category: Joi.string().hex().length(24),
  availability: Joi.string().valid("available", "out_of_stock", "discontinued"),
  saleType: Joi.string().valid("sale", "rent", "both"),
  price: Joi.number().min(0),
  rentPrice: Joi.number().min(0),
  depositPrice: Joi.number().min(0),
  images: Joi.array().items(Joi.string().hex().length(24)),
  specifications: Joi.object({
    dimensions: Joi.object({
      length: Joi.number(),
      width: Joi.number(),
      height: Joi.number(),
      unit: Joi.string(),
    }),
    weight: Joi.object({
      value: Joi.number(),
      unit: Joi.string(),
    }),
    material: Joi.string(),
    color: Joi.string(),
    brand: Joi.string(),
  }),
  features: Joi.array().items(Joi.string()),
  warranty: Joi.string().trim(),
  condition: Joi.string().valid("new", "like_new", "good", "fair"),
  tags: Joi.array().items(Joi.string()),
  isFeatured: Joi.boolean(),
  quantity: Joi.number().integer().min(0),
};

export const remove = {
  id: Joi.string().hex().length(24).required(),
};
