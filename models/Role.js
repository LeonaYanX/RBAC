// backend/models/Role.js
require("./Permission");
const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");            //added autopopulate plugin

/**
 * @typedef {Object} Role
 * @property {string}                              name        - Unique role name, e.g. 'admin', 'user'.
 * @property {string}                              description - Optional description.
 * @property {mongoose.Schema.Types.ObjectId[]}    permissions - Array of Permission _id references.
 * @property {Date}                                createdAt   - Timestamp when created.
 * @property {Date}                                updatedAt   - Timestamp when last updated.
 */
const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,                                           // Mongoose-level enforcement
      index: true,                                           //create MongoDB index for uniqueness 
    },
    description: {
      type: String,
      default: "",
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
        autopopulate: true,                                   // enable autopopulate
      },
    ],
  },
  {
    timestamps: true,                                         //adds createdAt & updatedAt 
    versionKey: false,                                        //hides __v version key 
  }
);

//apply autopopulate plugin globally to schema 

RoleSchema.plugin(autopopulate);

module.exports = mongoose.model("Role", RoleSchema);
