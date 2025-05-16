const mongoose = require("mongoose");

/**
 * Schema for defining permissions that can be assigned to roles.
 *
 * @typedef {Object} Permission
 * @property {string} key         - Unique permission identifier, e.g. "user.create", "user.delete"
 * @property {string} description - Optional human-readable description of what the permission allows
 */
const PermissionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,               // unique permission key
      index: true,               // create an index for faster lookups
    },
    description: {
      type: String,
      default: "",                // default to empty string if no description is provided
    },
  },
  {
    timestamps: true,             // adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Permission", PermissionSchema);
