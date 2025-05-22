// backend/models/Photo.js
const mongoose = require("mongoose");

/**
 * PhotoSchema saves photo in Buffer format
 * and it's MIME-type for client.
 */
const PhotoSchema = new mongoose.Schema(
  {
    // Binary data of the photo
    data: {
      type: Buffer,
      required: true,
    },
    // MIME-type of the photo
    // e.g. image/jpeg, image/png
    contentType: {
      type: String,
      required: true,
    },
    // filename of the photo
    // e.g. photo.jpg
    filename: {
      type: String,
      default: "",
    },
    // User who uploaded the photo
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Photo", PhotoSchema);
