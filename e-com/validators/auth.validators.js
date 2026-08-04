import { body, validationResult } from "express-validator";

export const validateRegister = [
  body("email")
    .isEmail()
    .withMessage((value, { req }) => req.t("enterValidEmail")),
  body("password")
    .isLength({ min: 6 })
    .withMessage((value, { req }) => req.t("passwordMinLength")),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage((value, { req }) => req.t("invalidRole")),
  body("userName")
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 100 })
    .withMessage((value, { req }) => req.t("userNameLength")),
  body("city")
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 100 })
    .withMessage((value, { req }) => req.t("city")),
  body("postalCode")
    .trim()
    .notEmpty()
    .isLength({ min: 5, max: 10 })
    .withMessage((value, { req }) => req.t("postalCode")),
  body("addressLine1")
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 200 })
    .withMessage((value, { req }) => req.t("addressLine1")),
  body("addressLine2")
    .trim()
    .optional()
    .isLength({ max: 200 })
    .withMessage((value, { req }) => req.t("addressLine2Length")),
  body("phoneNumber")
    .trim()
    .notEmpty()
    .matches(/^\+?[1-9]\d{1,15}$/)
    .isLength({ min: 10, max: 15 })
    .withMessage((value, { req }) => req.t("phoneNumber")),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateLogin = [
  body("email")
    .isEmail()
    .withMessage((value, { req }) => req.t("enterValidEmail")),

  body("password")
    .isLength({ min: 6 })
    .withMessage((value, { req }) => req.t("passwordMinLength")),
];

export const updateValidate = [
  body("email")
    .optional()
    .isEmail()
    .withMessage((value, { req }) => req.t("enterValidEmail")),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage((value, { req }) => req.t("passwordMinLength")),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage((value, { req }) => req.t("invalidRole")),
  body("userName")
    .trim()
    .optional()
    .notEmpty()
    .isLength({ min: 2, max: 100 })
    .withMessage((value, { req }) => req.t("userNameLength")),
  body("city")
    .trim()
    .optional()
    .notEmpty()
    .isLength({ min: 2, max: 100 })
    .withMessage((value, { req }) => req.t("city")),
  body("postalCode")
    .trim()
    .optional()
    .notEmpty()
    .isLength({ min: 5, max: 10 })
    .withMessage((value, { req }) => req.t("postalCode")),
  body("addressLine1")
    .trim()
    .optional()
    .notEmpty()
    .isLength({ min: 2, max: 200 })
    .withMessage((value, { req }) => req.t("addressLine1")),
  body("addressLine2")
    .trim()
    .optional()
    .isLength({ max: 200 })
    .withMessage((value, { req }) => req.t("addressLine2Length")),
  body("phoneNumber")
    .trim()
    .optional()
    .notEmpty()
    .matches(/^\+?[1-9]\d{1,15}$/)
    .isLength({ min: 10, max: 15 })
    .withMessage((value, { req }) => req.t("phoneNumber")),
];
