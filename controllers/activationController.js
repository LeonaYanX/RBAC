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
    avatar,
    phone,
    status: "active",
  };
  await findUserByIdAndUpdate(record.user, updateData);

  // 3) Удаляем запись активации
  await record.deleteOne();

  res.json({ message: "Account activated" });
};
