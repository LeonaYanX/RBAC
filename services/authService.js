// backend/services/authService.js
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const {
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenLife,
  refreshTokenLife,
} = require("../config/jwt");

/**
 * Генерация Access Token
 * @param {{ _id: string, roleName: string }} user
 * @returns {string} JWT
 */
function generateAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.roleName }, accessTokenSecret, {
    expiresIn: accessTokenLife,
  });
}

/**
 * Генерация и сохранение Refresh Token
 * @param {{ _id: string, roleName: string }} user
 * @returns {Promise<string>} JWT
 */
async function generateRefreshToken(user) {
  // Собираем payload
  const payload = { id: user._id, role: user.roleName };
  const token = jwt.sign(payload, refreshTokenSecret, {
    expiresIn: refreshTokenLife,
  });

  // Считаем дату истечения (7 дней)
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  // Сохраняем в БД для последующего отзыва
  await RefreshToken.create({ token, user: user._id, expires });
  return token;
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
