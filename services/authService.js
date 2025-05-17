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
async function generateRefreshToken(userId) {
  // 1) forming new JWT
  const payload = { id: userId };
  const token = jwt.sign(payload, refreshTokenSecret, {
    expiresIn: refreshTokenLife, // e.g. '7d'
  });

  // 2) Counting the expiration date
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // 3) updating or creating the refresh token in the database
  const filter = { user: userId };
  const update = { token, expires };
  const options = {
    upsert: true,    // create if not exists 
    new: true,       // return updated doc
    setDefaultsOnInsert: true,
  };

  await RefreshToken.findOneAndUpdate(filter, update, options).exec();  
  return token;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
