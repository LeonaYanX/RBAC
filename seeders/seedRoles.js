/**
 * node backend/seeders/seedRoles.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Только права по users — больше нет никаких post.*
  const rolesConfig = {
    user: ["user.read"], // обычный пользователь — только чтение своего профиля
    moderator: ["user.read", "user.delete"], // модератор — читать и удалять пользователей
    admin: ["user.*", "role.assign"], // админ — полный CRUD по users + назначение ролей
    assistant: ["user.read"], // ассистент — только чтение
    superadmin: ["*"], // супер-админ — все права
  };

  for (const [roleName, permKeys] of Object.entries(rolesConfig)) {
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
    );

    console.log(`✔️ Role synced: ${roleName}`);
  }

  console.log("✅ All user-based roles have been seeded/updated");
  mongoose.disconnect();
});
