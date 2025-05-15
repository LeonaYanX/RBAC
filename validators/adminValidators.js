// backend/validators/adminValidators.js
const { body, validationResult } = require("express-validator");

/**
 * Правила валидации для createUser:
 *  - email: обязателен, валиден формат
 *  - roleName: обязателен, строка не пустая
 */
exports.createUserRules = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email"), // проверка формата :contentReference[oaicite:1]{index=1}
  body("roleName")
    .exists()
    .withMessage("Role name is required")
    .isString()
    .withMessage("Role name must be a string")
    .notEmpty()
    .withMessage("Role name cannot be empty"),
];

/**
 * Middleware для обработки ошибок валидации.
 * Если есть ошибки, бросает их — попадут в глобальный errorHandler.
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Массив ошибок вида [{ field, msg }, ...]
    const extracted = errors
      .array()
      .map((e) => ({ field: e.param, msg: e.msg }));
    return res.status(400).json({ status: "error", errors: extracted });
  }
  next();
};
