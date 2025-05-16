/**
 * Запускайте командой:
 * node backend/seeders/seedPermissions.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Permission = require("../models/Permission");

dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const keys = [ // заполняем массив правами, которые хотим создать
    "user.create",
    "user.read",
    "role.assign",// право назначать роли
    "user.delete", 
  ];

  for (const key of keys) {
    const exists = await Permission.findOne({ key });
    if (!exists) {
      await Permission.create({ key, description: "" }); // создаем право заполнив описание
      console.log(`Created permission: ${key}`);
    }
  }

  console.log("Permissions seeding done");
  mongoose.disconnect();
});
