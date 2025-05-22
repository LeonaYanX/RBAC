// backend/controllers/activationController.js

const {
  findActivationToken,
  findUserByIdAndUpdate,
  savePhoto,                
} = require("../services/dbServices");
const bcrypt = require("bcryptjs");

/**
 * Activates the user account using the token provided in the activation email.
 *
 * Expected:
 *   - URL param: token
 *   - Body: { username, password, phone }
 *   - Files: photos[] (Multer загружает их в req.files)
 *
 * Process:
 *   1. Validate token
 *   2. Validate required fields (username, password)
 *   3. Hash password
 *   4. Save uploaded photos
 *   5. Update user with new data & activate account
 *   6. Delete activation token
 *   7. Send success response
 */
exports.activate = async (req, res) => {
  const { token } = req.params;
  const { username, password, phone } = req.body;
  const files = req.files || [];                    

  // 1) Validate token parameter
  if (!token || token === "undefined") {
    return res
      .status(400)
      .json({ status: "error", message: "Token is required" });
  }

  // 2) Validate required fields
  if (!username || !password) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "Username and password are required",
      });
  }

  // 3) Find activation token record
  const record = await findActivationToken(token);
  if (!record || record.expires < Date.now()) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "Invalid or expired activation link",
      });
  }

  // 4) Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5) Save uploaded photos one by one
  // and collect their IDs in an array
  const photoIds = [];
  for (const file of files) {
    // savePhoto(buffer, mimeType, ownerId) returns doc of Photo
    const photo = await savePhoto(file.buffer, file.mimetype, record.user);
    photoIds.push(photo._id);
  }

  // 6) Clean optional phone field
  const phoneValue = phone && phone.trim() !== "" ? phone : null;

  // 7) Обновляем пользователя
  const updateData = {
    username,
    password: hashedPassword,
    photos: photoIds,              
    phone: phoneValue,
    status: "active",
  };
  await findUserByIdAndUpdate(record.user, updateData);

  // 8) delete activation token
  await record.deleteOne();

  // 9) Send success response
  res
    .status(200)
    .json({ status: "success", message: "Account activated" });
};
