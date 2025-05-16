/**
 * This script is used to seed the database with default permissions.
 * It connects to the MongoDB database, checks if certain permissions exist,
 * node backend/seeders/seedRoles.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Configure the role permissions
  // This is a mapping of role names to their respective permission keys.
  const rolesConfig = {
    user: ["user.read"], // usual user — only read
    moderator: ["user.read", "user.delete"], // moderator — read + delete
    admin: ["user.*", "role.assign"], // admin — all user permissions + assign roles
    assistant: ["user.read"], // assistant — only read
    superadmin: ["*"], // superadmin — all permissions
  };

  for (const [roleName, permKeys] of Object.entries(rolesConfig)) { // Перебираем роли и их права
    // 1) gathering ObjectId of permissions
    let perms;
    if (permKeys.includes("*")) {
      // '*' — taking all permissions from the database
      perms = await Permission.find();
    } else {
      perms = await Permission.find({ key: { $in: permKeys } });
    }
    const permIds = perms.map((p) => p._id);

    // 2) Creating/updating the role
    // upsert: true — creates the role if it doesn't exist
    await Role.findOneAndUpdate(
      { name: roleName },
      { permissions: permIds },
      { upsert: true, new: true, setDefaultsOnInsert: true } 
      // new: true — returns the updated document
      // setDefaultsOnInsert: true — sets default values for fields
      // that are not specified in the update (like description)
    );

    console.log(` Role synced: ${roleName}`);
  }

  console.log("All roles have been seeded/updated");
  mongoose.disconnect();
});
