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
 * Generating Access Token
 * @param {{ _id: string, roleName: string }} user
 * @returns {string} JWT
 */
function generateAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.roleName }, accessTokenSecret, {
    expiresIn: accessTokenLife,
  });
}

/**
 * Generating and saving the Refresh Token
 * @param {{ _id: string, roleName: string }} user
 * @returns {Promise<string>} JWT
 */
async function generateRefreshToken(user) {
  // payload
  const payload = { id: user._id, role: user.roleName };
  const token = jwt.sign(payload, refreshTokenSecret, {
    expiresIn: refreshTokenLife,
  });

  // Expires in 7 days
  // (e.g. new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  // Saving the refresh token to DB
  await RefreshToken.create({ token, user: user._id, expires });
  return token;
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
