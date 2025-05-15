/**
 * Запускайте командой:
 * node backend/seeders/seedPermissions.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Permission = require("../models/Permission");

dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const keys = [
    "user.create",
    "user.read",
    "role.assign",
    "user.delete", // право назначать роли
  ];

  for (const key of keys) {
    const exists = await Permission.findOne({ key });
    if (!exists) {
      await Permission.create({ key, description: "" });
      console.log(`Created permission: ${key}`);
    }
  }

  console.log("✅ Permissions seeding done");
  mongoose.disconnect();
});
