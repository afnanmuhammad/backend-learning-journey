import { body, validationResult } from "express-validator";

const createProductValidation = [
  body("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product title must be between 2 and 100 characters")
    .trim(),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 5, max: 1000 })
    .withMessage("Description must be between 5 and 1000 characters")
    .trim(),

  body("countInStock")
    .notEmpty()
    .withMessage("Stock count is required")
    .isInt({ min: 0 })
    .withMessage("Stock count must be a positive integer"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

export { createProductValidation, handleValidationErrors };
