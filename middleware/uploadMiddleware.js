// backend/middleware/uploadMiddleware.js
const multer = require("multer");

// we store the image in memory to save it in the database
// in the future we can use cloud storage like AWS S3 or Google Cloud Storage
const storage = multer.memoryStorage();

// fileFilter checks if the file is an image
// and if it is, it calls the callback with null and true
function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5 MB
// }).single("photo"); // field name in the form is "photo"

});

module.exports = upload;
