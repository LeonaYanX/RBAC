const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenLife,
} = require("../config/jwt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/authService");
const crypto = require("crypto");
const {
  findUserByEmail,
  deletePassResetTokenByUserId,
  createPasswordResetToken,
  findUserById,
  findPasswordResetToken,
  findRefreshToken,
  deleteRefreshToken,
  saveUser,
  deleteResettoken,
} = require("../services/dbServices");
const sendEmail = require("../services/emailService");
const RoleFactory = require('../factories/roleFactory');

/**
 * Handles user login: validates credentials, issues access & refresh tokens.
 *
 * @param {Object} req – Express request object
 * @param {Object} req.body.email – User email
 * @param {Object} req.body.password – User password
 * @param {Object} res – Express response object
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Email and password are required" });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid email or password" });
  }

  if (user.status !== "active") {
    return res
      .status(403)
      .json({ status: "error", message: "Please activate your account first" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid email or password" });
  }

  
  const roleName = user.role.name;
  const payload = { id: user._id.toString(), role: roleName }; 
  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenLife,
  });
  const refreshToken = await generateRefreshToken(user._id);

  const { permissions } = await RoleFactory.get(roleName);

  res.status(200).json({
    status: "success",
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: roleName,
        permissions,
      },
    },
  });
};

/**
 * Sends a password-reset link if email is registered.
 *
 * @param {Object} req – Express request object
 * @param {string} req.body.email – User email
 * @param {Object} res – Express response object
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validate input
  if (!email) {
    return res
      .status(400)
      .json({ status: "error", message: "Email is required" });
  }

  // Find user
  const user = await findUserByEmail(email);
  if (!user) {
    // Do not reveal whether email exists
    return res.status(200).json({
      status: "success",
      message: "If that email is registered, you will receive a reset link.",
    });
  }

  // Remove existing reset token
  await deletePassResetTokenByUserId(user._id);

  // Create new reset token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  await createPasswordResetToken(user._id, token, expires);

  // Send email
  const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const html = `
    <h1>Password Reset</h1>
    <p>Click the link to reset your password (valid for 1 day):</p>
    <a href="${link}">${link}</a>
  `;
  try {
    await sendEmail(email, "Reset your password", html);
  } catch (err) {
    console.error("Error sending email:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to send reset email" });
  }

  res.status(200).json({
    status: "success",
    message: "Reset link sent to email.",
  });
};

/**
 * Resets password given a valid token.
 *
 * @param {Object} req – Express request object
 * @param {string} req.params.token – Password reset token
 * @param {string} req.body.newPassword – New password
 * @param {string} req.body.confirmPassword – Confirmation password
 * @param {Object} res – Express response object
 */
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  // Validate input
  if (!token) {
    return res
      .status(400)
      .json({ status: "error", message: "Token is required" });         
  }
  if (!newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ status: "error", message: "New password and confirmation are required" });
  }
  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ status: "error", message: "Passwords do not match" });
  }

  // Find and verify token
  const record = await findPasswordResetToken(token);
  if (!record || record.expires < Date.now()) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid or expired token" });
  }

  // Find user
  const user = await findUserById(record.user);
  if (!user) {
    return res
      .status(400)
      .json({ status: "error", message: "User not found" });
  }

  // Update password
  user.password = await bcrypt.hash(newPassword, 10);
  await saveUser(user);

  // Delete reset token
  await deleteResettoken(record);                                        

  res.status(200).json({
    status: "success",
    message: "Password successfully reset",
  });
};

/**
 * Issues a new access token given a valid refresh token.
 *
 * @param {Object} req – Express request object
 * @param {string} req.body.refreshToken – The refresh token
 * @param {Object} res – Express response object
 */
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res
      .status(400)
      .json({ status: "error", message: "Refresh token is required" });
  }

  const saved = await findRefreshToken(refreshToken);
  if (!saved) {
    return res
      .status(403)
      .json({ status: "error", message: "Refresh token not found" });
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, refreshTokenSecret);
  } catch {
    return res
      .status(403)
      .json({ status: "error", message: "Invalid refresh token" });
  }

  if (saved.expires < Date.now()) {
    await deleteRefreshToken(refreshToken);
    return res
      .status(403)
      .json({ status: "error", message: "Refresh token expired" });
  }

  
  const newAccessToken = jwt.sign(
    { id: payload.id, role: payload.role }, 
    accessTokenSecret,
    { expiresIn: accessTokenLife }
  );

  res.status(200).json({
    status: "success",
    data: { accessToken: newAccessToken },
  });
};


/**
 * Logs out the user by deleting their refresh token.
 *
 * @param {Object} req – Express request object
 * @param {string} req.body.refreshToken – The refresh token to delete
 * @param {Object} res – Express response object
 */
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await deleteRefreshToken(refreshToken);
  }
  res.status(200).json({ status: "success", message: "Logged out" });
};
