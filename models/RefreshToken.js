const mongoose = require("mongoose");

/**
 * Schema for storing refresh tokens.
 * Each document represents a single refresh token issued to a user.
 *
 * @typedef {Object} RefreshToken
 * @property {string}                   token     - The JWT refresh token string (unique).
 * @property {mongoose.Schema.Types.ObjectId} user - Reference to the User who owns this token.
 * @property {Date}                     expires   - Date/time when the token expires.
 * @property {Date}                     createdAt - Timestamp when the token was created.
 * @property {Date}                     updatedAt - Timestamp when the token was last updated.
 */
const RefreshTokenSchema = new mongoose.Schema(
  {
    token: {
      // The JWT refresh token
      type: String,
      required: true,
      unique: true,
    },
    user: {
      // Reference to the User model
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expires: {
      // Expiration date of the token
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,            // Automatically add createdAt and updatedAt fields
    
  }
);

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
