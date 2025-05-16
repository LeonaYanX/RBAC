// backend/validators/adminValidators.js
const { body, validationResult } = require("express-validator");

/**
 * Validation rules for createUser:
 *  - email: required, must be a valid email
 *  - roleName: required, must be a string, cannot be empty
 */
exports.createUserRules = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email"), 
  body("roleName")
    .exists()
    .withMessage("Role name is required")
    .isString()
    .withMessage("Role name must be a string")
    .notEmpty()
    .withMessage("Role name cannot be empty"),
];

/**
 * Middleware to validate request data.
 * If there will be errors they will pass to errorHandler.
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //Error array: [{ field, msg }, ...]
    const extracted = errors
      .array()
      .map((e) => ({ field: e.param, msg: e.msg }));
    return res.status(400).json({ status: "error", errors: extracted });
  }
  next();
};
