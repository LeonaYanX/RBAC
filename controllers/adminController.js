// backend/controllers/adminController.js
const crypto = require("crypto");
const { sendEmail } = require("../services/emailService");
const {
  findUserByEmail,
  findRoleByName,
  createPartialUser,
  createActivationToken,
} = require("../services/dbServices");
/**
 * Супер-админ создаёт «чернового» пользователя:
 *  - email и роль
 *  - статус = 'inactive'
 *  - генерируется токен активации
 *  - отправляется письмо с ссылкой
 */
exports.createUser = async (req, res) => {
  const { email, roleName } = req.body;
  if (!email || !roleName) {
    return res.status(400).json({ error: "Email and role are required" });
  }
  // 1) Проверка наличия email
  let user = findUserByEmail(email);
  if (user) return res.status(400).json({ error: "User already exists" });

  // 2) Находим роль
  const role = await findRoleByName(roleName);
  if (!role) return res.status(400).json({ error: "Invalid role" });

  // 3) Создаём пользователя со статусом inactive
  user = createPartialUser({ email: email, roleId: role._id });

  // 4) Генерируем токен активации (случайная строка)
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ч

  // 5) Сохраняем токен
  await createActivationToken(user._id, token, expires);

  // 6) Формируем ссылку
  const link = `${process.env.FRONTEND_URL}/activate/${token}`;

  // 7) Отправляем письмо
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
    return res.status(500).json({ error: "Failed to send activation email" });
  }

  res.status(200).json({ message: "Activation email sent" });
};
