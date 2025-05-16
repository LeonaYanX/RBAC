const mongoose = require("mongoose");

/**
 * Schema for activation tokens.
 * Stores a one-time token used to activate user accounts.
 *
 * @typedef {Object} ActivationToken
 * @property {mongoose.Schema.Types.ObjectId} user    - Reference to the User model (one token per user)
 * @property {string}                   token           - Unique activation token string
 * @property {Date}                     expires         - Expiration date/time of the token
 * @property {Date}                     createdAt       - Timestamp when document was created
 * @property {Date}                     updatedAt       - Timestamp when document was last updated
 */
const ActivationTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one token per user
    },
    token: {
      type: String,
      required: true,
      unique: true, // token must be unique
    },
    expires: {
      type: Date,
      required: true, // expiration date must be set
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);



module.exports = mongoose.model("ActivationToken", ActivationTokenSchema);
