// backend/controllers/activationController.js

const {
  findActivationToken,
  findUserByIdAndUpdate,
} = require("../services/dbServices");
const bcrypt = require("bcryptjs");

/**
 * Активирует пользователя и сохраняет остальные данные из формы:
 *  - пароль, username, avatar, phone…
 *  - статус → 'active'
 */
exports.activate = async (req, res) => {
  const { token } = req.params;
  const { username, password, avatar, phone } = req.body;
 if(!token || token === "undefined") {
    return res.status(400).json({ error: "Token is required" });
  }
 
  const avatarValue = avatar && avatar.trim() !== '' ? avatar : null;
// / avatar может быть пустым, если пользователь не загрузил его
  const phoneValue = phone && phone.trim() !== '' ? phone : null;
// / phone может быть пустым, если пользователь не указал его

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  // 1) Находим токен
  const record = await findActivationToken(token);
  if (!record || record.expires < Date.now()) {
    return res
      .status(400)
      .json({ error: "Invalid or expired activation link" });
  }

  // 2) Находим и обновляем пользователя
  const hashedPassword = await bcrypt.hash(password, 10);
  const updateData = {
    username,
    password: hashedPassword,
    avatar: avatarValue,
    phone: phoneValue,
    status: "active",
  };
  await findUserByIdAndUpdate(record.user, updateData);

  // 3) Удаляем запись активации
  await record.deleteOne();

  res.status(200).json({message: "Account activated" });
};
