// backend/controllers/authController.js
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
  findRefreshToken,
  deleteRefreshToken,
  saveUser,
  deleteResettoken
} = require("../services/dbServices");
const sendEmail = require("../services/emailService");

/**
 * Вход: выдача access + refresh
 */
exports.login = async (req, res) => {
  
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 1) Ищем пользователя и подгружаем имя роли
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid data. " });

    // 1.1) Проверяем статус
    if (user.status !== "active") {
      return res
        .status(403)
        .json({ error: "Please activate your account first" });
    }

    // 2) Проверяем пароль
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid data..." });

    // 3) Сформируем access и refresh токены
    const roleName = user.role.name; // из populate
    const accessToken = generateAccessToken({ _id: user._id, roleName });
    const refreshToken = await generateRefreshToken({
      _id: user._id,
      roleName,
    });

    // 4) Отправляем клиенту оба токена
    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: roleName,
        message: "Login successful" // сообщение для клиента
      }, 
    });
};

/**
 * 1) Запрос на сброс пароля:
 *    POST /api/auth/forgot-password
 *    Body: { email }
 */
exports.forgotPassword = async (req, res) => {
 
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    // 1. Найти пользователя по email
    const user = await findUserByEmail(email);
    if (!user) {
      // во избежание утечки информации, вернуть 200 независимо
      return res.status(200).json({
        message: "If that email is registered, you will receive a reset link.",
      });
    }

    // 2. Удалить старый токен (если есть)
    await deletePassResetTokenByUserId(user._id);

    // 3. Сгенерировать случайный токен
    const token = crypto.randomBytes(32).toString("hex");
    // 4. Срок жизни, 1 день
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 5. Сохранить в БД
    await createPasswordResetToken(user._id, token, expires);

    // 6. Сформировать ссылку для фронта
    const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // 7. Отправить письмо
    const html = `
      <h1>Password Reset</h1>
      <p>Click the link to reset your password (valid for 1d):</p>
      <a href="${link}">${link}</a>
    `;
    try{
      await sendEmail(email, "Reset your password", html);
    }
    catch (err) {
      console.error("Error sending email:", err);
      return res.status(500).json({ error: "Failed to send reset email" });
    }
     res.status(200).json({ message: "Reset link sent to email." });
};

/**
 * 2) Сброс пароля по токену:
 *    POST /api/auth/reset-password/:token
 *    Body: { newPassword, confirmPassword }
 */
exports.resetPassword = async (req, res) => {
  
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    if(!token || token === "undefined") {
      return res.status(400).json({ error: "Token is required" });
    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ error: "New password and confirmation are required" });
    }
    // 1. Проверка совпадения паролей
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // 2. Найти токен в БД
    const record = await findPasswordResetToken(token);
    if (!record || record.expires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // 3. Найти пользователя
    const user = await findUserById(record.user);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // 4. Хешировать новый пароль
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await saveUser(user); 

    // 5. Удалить использованный токен
    await deleteResettoken(record); 

    res.status(200).json({ message: "Password successfully reset" });
};

/**
 * Endpoint для обновления access токена.
 * Клиент посылает свой refreshToken, мы проверяем его и если OK — даём новый access.
 */
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ error: "Нет refreshToken" });

    // 1) Найдём токен в БД
    const saved = await findRefreshToken(refreshToken);
    if (!saved)
      return res.status(403).json({ error: "Refresh токен не найден" });

    // 2) Проверим подпись
    let payload;
    try {
      payload = jwt.verify(refreshToken, refreshTokenSecret);
    } catch {
      return res.status(403).json({ error: "Неверный refresh токен" });
    }

    // 3) Проверим срок жизни
    if (saved.expires < new Date()) {
      await saved.deleteOne(); // удаляем просроченный
      return res.status(403).json({ error: "Refresh токен просрочен" });
    }

    // 4) Сформируем новый access
    const newAccessToken = jwt.sign(
      { id: payload.id, role: payload.role },
      accessTokenSecret,
      { expiresIn: accessTokenLife }
    );

    res.status(200).json({ accessToken: newAccessToken });
};

/**
 * Логаут (отзыв refresh токена)
 */
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await deleteRefreshToken(refreshToken);
  }
  res.status(200).json({ message: "Logged out" });
};
