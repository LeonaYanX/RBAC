// Подключаем Express и создаём роутер
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { loginRules, validate } = require("../validators/authValidators");

// Подключаем методы из контроллера
const {
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// -----------------------------------------------------------------------------
// 1) Маршрут для входа (login):
//    - URL:    POST /api/auth/login
//    - Тело запроса (JSON): { email: string, password: string }
//    - Ответ:  { accessToken, refreshToken, user }
// -----------------------------------------------------------------------------
router.post("/login", loginRules, validate, asyncHandler(login));

// -----------------------------------------------------------------------------
// 2) Маршрут для обновления access-токена:
//    - URL:    POST /api/auth/refresh
//    - Тело запроса (JSON): { refreshToken: string }
//    - Ответ:  { accessToken: string }
// -----------------------------------------------------------------------------
router.post("/refresh", refreshToken);

// -----------------------------------------------------------------------------
// 3) Маршрут для логаута (отзыв refresh-токена):
//    - URL:    POST /api/auth/logout
//    - Тело запроса (JSON): { refreshToken: string }
//    - Ответ:  { message: string }
// -----------------------------------------------------------------------------
router.post("/logout", logout);

// -----------------------------------------------------------------------------
// Экспортируем роутер, чтобы подключить его в server.js
// -----------------------------------------------------------------------------

// Запрос на сброс пароля (отправка письма)
router.post("/forgot-password", forgotPassword);

// Сброс пароля по токену
router.post("/reset-password/:token", resetPassword);
module.exports = router;
