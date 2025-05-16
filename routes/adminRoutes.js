// backend/routes/adminRoutes.js

const express = require("express");
const asyncHandler = require("express-async-handler");
const { createUserRules, validate } = require("../validators/adminValidators");
const router = express.Router();

// 1) Подключаем middleware для аутентификации и авторизации
const { authenticate, authorize } = require("../middleware/authMiddleware");

// 2) Подключаем метод контроллера
const { createUser } = require("../controllers/adminController");

// -----------------------------------------------------------------------------
// POST /api/admin/create-user
//
// Описание:
//   - Доступен только залогиненному супер-админу.
//   - Проверяется право 'role.assign' (назначение ролей).
//   - Принимает JSON в теле: { email: string, roleName: string }.
//   - Вызывает adminController.createUser, который создаёт
//     пользователя со статусом 'inactive' и шлёт activation-письмо.
// -----------------------------------------------------------------------------
router.post(
  "/create-user",
  authenticate, // 1) Проверяем валидность access-токена 
  authorize("role.assign"),
  // 2) Проверяем, что у роли есть право назначать роли
  createUserRules,
  validate, 
  asyncHandler(createUser) // 3) Вызываем логику создания пользователя и отправки письма
);

module.exports = router;
