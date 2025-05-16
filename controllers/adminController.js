const crypto = require("crypto");
const { sendEmail } = require("../services/emailService");
const {
  findUserByEmail,
  findRoleByName,
  createPartialUser,
  createActivationToken,
} = require("../services/dbServices");

/**
 * Creates a placeholder user (inactive) and sends activation email.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.createUser = async (req, res) => {
  const { email, roleName } = req.body;

  // 0) Validate input
  if (!email || !roleName) {
    return res
      .status(400)
      .json({ status: "error", message: "Email and role are required" });
  }

  // 1) Checking user existance by email
  const existingUser = await findUserByEmail(email);             
  if (existingUser) {
    return res
      .status(400)
      .json({ status: "error", message: "User already exists" });
  }

  // 2) Find role by name
  //    (e.g. "admin", "user", "moderator")
  const role = await findRoleByName(roleName);
  if (!role) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid role" });
  }

  // 3) Creating partial user with  inactive status
  //    (e.g. { email, role: role._id, status: "inactive" })
  const user = await createPartialUser(email, role._id);        

  // 4) Generating activation token
  //    (e.g. crypto.randomBytes(32).toString("hex"))
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ч

  // 5) Saving activation token to DB
  await createActivationToken(user._id, token, expires);        

  // 6) Creating activation link
  //    (e.g. `${process.env.FRONTEND_URL}/activate/${token}`)
  const link = `${process.env.FRONTEND_URL}/activate/${token}`;

  // 7) Sending activation email
  //    (e.g. sendEmail(email, "Activate your account", html))
  const html = `
    <h1>Welcome to MyApp!</h1>
    <p>For account activation follow the link:</p>
    <a href="${link}">${link}</a>
    <p>Link is active for 24 hours.</p>
  `;
  try {
    await sendEmail(email, "Activate your account on MyApp", html);
  } catch (err) {
    console.error("Error sending email:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to send activation email" });
  }

  // 8) Sending success response
  //    (e.g. res.status(200).json({ status: "success", message: "Activation email sent" }))
  res
    .status(200)
    .json({ status: "success", message: "Activation email sent" });
};
