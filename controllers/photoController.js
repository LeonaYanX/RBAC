// backend/controllers/photoController.js
const Photo = require("../models/Photo");
const User = require("../models/User");

/**
 * POST /api/photos
 * gets multipart/form-data with field "photo" and
 * optional "owner" (ID).
 * Saves it to MongoDB and returns URL.
 */
exports.uploadPhoto = async (req, res) => {
  // Multer uploads file in req.file
  if (!req.file) {
    return res.status(400).json({ status: "error", message: "Photo file is required" });
  }

  // Saving in Photo
  const photo = await Photo.create({
    data: req.file.buffer,
    contentType: req.file.mimetype,
    filename: req.file.originalname,
    owner: req.body.owner || null,
  });

  // If there is an owner ID, we add the photo to the user's photos array
  if (req.body.owner) {
    await User.findByIdAndUpdate(req.body.owner, {
      $push: { photos: photo._id }
    });
  }

  // returning URL
  const url = `${req.protocol}://${req.get("host")}/api/photos/${photo._id}`;
  res.status(201).json({ status: "success", data: { url } });
};

/**
 * GET /api/photos/:photo_id
 * Fetches photo by ID from MongoDB and sends it as a response.
 * Sets the Content-Type header to the photo's MIME type.
 */
exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.photo_id);
  if (!photo) {
    return res.status(404).json({ status: "error", message: "Photo not found" });
  }
  res.set("Content-Type", photo.contentType);
  res.send(photo.data);
};
