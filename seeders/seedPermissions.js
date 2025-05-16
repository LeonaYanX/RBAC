/**
 * This script is used to seed the database with default permissions.
 * It connects to the MongoDB database, checks if certain permissions exist,
 * node backend/seeders/seedPermissions.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Permission = require("../models/Permission");

dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const keys = [ // enumeration of permissions we want to create
    "user.create",
    "user.read",
    "role.assign",// role assignment permission
    "user.delete", 
  ];

  for (const key of keys) {
    const exists = await Permission.findOne({ key });
    if (!exists) {
      await Permission.create({ key, description: "" }); // create permission with empty description
      // or you can provide a meaningful description
      // await Permission.create({ key, description: "Description for " + key });
      console.log(`Created permission: ${key}`);
    }
  }

  console.log("Permissions seeding done");
  mongoose.disconnect();
});
