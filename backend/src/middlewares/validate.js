import Joi from "joi";

const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

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
