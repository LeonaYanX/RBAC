// backend/validators/authValidators.js
const { body, validationResult } = require("express-validator");

/** Rules for login */
exports.loginRules = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Min length 6"),
];

/** Checking result */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw errors; // попадёт в errorHandler
  next();
};
