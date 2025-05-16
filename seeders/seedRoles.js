/**
 * node backend/seeders/seedRoles.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Конфигурация ролей и прав
  // Здесь можено настроить роли и их права
  const rolesConfig = {
    user: ["user.read"], // обычный пользователь — только чтение пользователей
    moderator: ["user.read", "user.delete"], // модератор — читать и удалять пользователей
    admin: ["user.*", "role.assign"], // админ — полный CRUD по users + назначение ролей
    assistant: ["user.read"], // ассистент — только чтение
    superadmin: ["*"], // супер-админ — все права
  };

  for (const [roleName, permKeys] of Object.entries(rolesConfig)) { // Перебираем роли и их права
    // 1) Собираем ObjectId разрешений по ключам
    let perms;
    if (permKeys.includes("*")) {
      // '*' — берём все записи из permissions
      perms = await Permission.find();
    } else {
      perms = await Permission.find({ key: { $in: permKeys } });
    }
    const permIds = perms.map((p) => p._id);

    // 2) Создаём или обновляем роль
    await Role.findOneAndUpdate(
      { name: roleName },
      { permissions: permIds },
      { upsert: true, new: true, setDefaultsOnInsert: true } 
      // upsert: true — создаёт, если не существует
      // new: true — возвращает обновлённый документ
      // setDefaultsOnInsert: true — устанавливает значения по умолчанию
      // при создании нового документа
    );

    console.log(` Role synced: ${roleName}`);
  }

  console.log("All roles have been seeded/updated");
  mongoose.disconnect();
});
