/**
 * Скрипт для создания и удаления супер-админа.
 *
 * Запуск:
 *   node backend/seeders/seedSuperAdmin.js create
 * или
 *   node backend/seeders/seedSuperAdmin.js delete
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db"); // подключаем функцию подключения к БД

// Подключаем модели
const Role = require("../models/Role");
const User = require("../models/User");

dotenv.config();

// Функция создания супер-админа
async function createSuperAdmin() {
  // 1. Находим роль superadmin
  const role = await Role.findOne({ name: "superadmin" });
  if (!role) {
    console.error("❌ Роль superadmin не найдена. Выполните seedRoles.js");
    process.exit(1);
  }

  // 2. Проверяем, нет ли уже пользователя с таким email
  const existing = await User.findOne({ email: "superadmin@example.com" });
  if (existing) {
    console.log("ℹ️ Супер-админ уже существует:", existing.email);
    return;
  }

  // 3. Хешируем пароль
  const plainPassword = process.env.SUPERADMIN_PASS; // в реальном приложении лучше брать из .env
  const hashed = await bcrypt.hash(plainPassword, 10);

  // 4. Создаём пользователя
  const user = await User.create({
    username: "superadmin",
    email: "superadmin@example.com",
    password: hashed,
    status: "active", // сразу активируем
    // avatar: 'https://example.com/avatar.png', // можно добавить аватар
    role: role._id,
  });
  console.log("✅ Создан супер-админ:", user.email);
  console.log("   логин:", user.username);
  console.log("   пароль:", plainPassword);
}

// Функция удаления супер-админа
async function deleteSuperAdmin() {
  const res = await User.deleteOne({ username: "superadmin" });
  if (res.deletedCount) {
    console.log("✅ Супер-админ удалён");
  } else {
    console.log("ℹ️ Супер-админ не найден, нечего удалять");
  }
}

// Основной поток
(async () => {
  await connectDB();

  const action = process.argv[2]; // 'create' или 'delete'

  if (action === "create") {
    await createSuperAdmin();
  } else if (action === "delete") {
    await deleteSuperAdmin();
  } else {
    console.log("Использование:");
    console.log(
      "  node seeders/seedSuperAdmin.js create   # создать супер-админа"
    );
    console.log(
      "  node seeders/seedSuperAdmin.js delete   # удалить супер-админа"
    );
  }

  mongoose.disconnect();
})();
