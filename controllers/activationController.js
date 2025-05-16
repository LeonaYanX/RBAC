const {
  findActivationToken,
  findUserByIdAndUpdate,
} = require("../services/dbServices");
const bcrypt = require("bcryptjs");

/**
 * Activates the user account using the token provided in the activation email.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * Expected:
 *   - URL param: token
 *   - Body: { username, password, avatar, phone }
 *
 * Process:
 *   1. Validate token
 *   2. Validate required fields (username, password)
 *   3. Hash password
 *   4. Update user with new data & activate account
 *   5. Delete activation token
 *   6. Send success response
 */
exports.activate = async (req, res) => {
  const { token } = req.params;
  const { username, password, avatar, phone } = req.body;

  // Validate token
  if (!token || token === "undefined") {
    return res.status(400).json({ status: "error", message: "Token is required" });
  }

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({ status: "error", message: "Username and password are required" });
  }

  // Clean optional fields (set to null if empty)
  const avatarValue = avatar && avatar.trim() !== "" ? avatar : null;
  const phoneValue = phone && phone.trim() !== "" ? phone : null;

  //  Find activation token
  const record = await findActivationToken(token);
  if (!record || record.expires < Date.now()) {
    return res.status(400).json({ status: "error", message: "Invalid or expired activation link" });
  }

  // Hash password and prepare data
  const hashedPassword = await bcrypt.hash(password, 10);
  const updateData = {
    username,
    password: hashedPassword,
    avatar: avatarValue,
    phone: phoneValue,
    status: "active",
  };

  // Update user
  await findUserByIdAndUpdate(record.user, updateData);

  //  Delete token record
  await record.deleteOne();

  // Success response
  res.status(200).json({ status: "success", message: "Account activated" });
};
