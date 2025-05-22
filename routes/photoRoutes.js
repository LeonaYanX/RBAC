// backend/routes/photoRoutes.js
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const upload = require("../middleware/uploadMiddleware");
const { uploadPhoto, getPhoto } = require("../controllers/photoController");
const { authenticate } = require("../middleware/authMiddleware");

// -----------------------------------------------------------------------------
// POST /api/photos
//   - needs authentication
//   - multipart/form-data with field "photo"
//   - optional field "owner" (ID)
//   - saves it to MongoDB and returns URL
// -----------------------------------------------------------------------------
router.post(
  "/photos",
  authenticate,
  upload.single("photo"),
  asyncHandler(uploadPhoto)
);

// -----------------------------------------------------------------------------
// GET /api/photos/:photo_id
//   - public route
//   - fetches photo by ID from MongoDB
//   - sends it as a response
// -----------------------------------------------------------------------------
router.get(
  "/photos/:photo_id",
  asyncHandler(getPhoto)
);

module.exports = router;
