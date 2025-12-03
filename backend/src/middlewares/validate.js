import Joi from "joi";

const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    // Skip validation for multipart/form-data (file uploads)
    // Multer handles file uploads and req.body will contain form fields as strings
    const isMultipart = req.headers['content-type']?.includes('multipart/form-data');
    
    // Convert string values to appropriate types for multipart data
    if (isMultipart && req.body) {
      // Convert numeric strings to numbers
      if (req.body.price) req.body.price = parseFloat(req.body.price) || undefined;
      if (req.body.rentPrice) req.body.rentPrice = parseFloat(req.body.rentPrice) || undefined;
      if (req.body.depositPrice) req.body.depositPrice = parseFloat(req.body.depositPrice) || 0;
      if (req.body.viewCount) req.body.viewCount = parseInt(req.body.viewCount) || 0;
      // Convert boolean strings
      if (req.body.isFeatured !== undefined) req.body.isFeatured = req.body.isFeatured === 'true';
    }

    // If schema has body property, validate body
    if (schema.body) {
      const { error } = schema.body.validate(req.body, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(detail => detail.message));
      }
    }
    // If schema is an object with Joi properties (direct validation)
    else {
      const { error } = Joi.object(schema).validate(req.body, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(detail => detail.message));
      }
    }

    // Validate params if schema.params exists
    if (schema.params) {
      const { error } = schema.params.validate(req.params, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(detail => detail.message));
      }
    }

    // Validate query if schema.query exists
    if (schema.query) {
      const { error } = schema.query.validate(req.query, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(detail => detail.message));
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation error",
        details: errors,
      });
    }
    next();
  };
};

export default validate;
