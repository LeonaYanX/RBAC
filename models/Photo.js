// backend/models/Photo.js
const mongoose = require('mongoose');

/**
 * @typedef {Object} Photo
 * @property {Buffer} data        - Raw binary data of the photo.
 * @property {string} contentType - MIME-type of the photo (e.g., image/jpeg).
 * @property {mongoose.ObjectId} owner - Reference to the User who owns this photo.
 */
const PhotoSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Photo', PhotoSchema);
