const mongoose = require("mongoose");

/**
 * @typedef {Object} User
 * @property {string} username - Unique username for the user.
 * @property {string} password - Hashed password for the user.
 * @property {string} email - Unique email address for the user.
 * @property {string} [photos] - URL to the user's avatar image.
 * @property {string} [phone] - Phone number of the user.
 * @property {'active'|'inactive'} status - Status of the user, either 'active' or 'inactive'.
 * @property {mongoose.Types.ObjectId} role - Reference to the Role model, defining the user's role.
 */

/**
 * Schema for the User model.
 * Each user has a unique username, email, and hashed password.
 */
const UserSchema = new mongoose.Schema({
  /**
   * Unique username for the user.
   */
  username: {
    type: String,
    unique: true,
  },

  /**
   * Password for the user.
   * This should be stored as a hashed value for security.
   */
  password: {
    type: String,
  },

  /**
   * Unique email address for the user.
   */
  email: {
    type: String,
    required: true,
    unique: true,
  },

  /**
   * URL to the user's avatar image.
   * This is an optional field and defaults to an empty string if not provided.
   */
  photos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo",
    },
  ],

  /**
    * Phone number of the user.
    * This is an optional field and defaults to an empty string if not provided.
    * It can be used for two-factor authentication or account recovery.
   */
  phone: {
    type: String,
    default: "",
  },

  /**
   * Status of the user.
   * This field indicates whether the user is active or inactive.
   */
  status: {
    type: String,
    enum: ["active", "inactive"],
  },

  /**
   * Reference to the Role model.
   * This field defines the user's role within the application.
   */
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
