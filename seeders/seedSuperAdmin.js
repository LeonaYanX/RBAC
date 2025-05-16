/**
 * This script is used to seed the database with default permissions.
 *
 * It creates a super-admin user with the username "superadmin" and the email "
 *   node backend/seeders/seedSuperAdmin.js create
 * or
 * deletes the super-admin user if it already exists.
 *   node backend/seeders/seedSuperAdmin.js delete
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db"); // connectDB - function to connect to MongoDB
const { User } = require("../models/User"); // User - Mongoose model for users

// Подключаем модели
const Role = require("../models/Role");
const User = require("../models/User");

dotenv.config();

// function to create a super-admin user
async function createSuperAdmin() {
  // 1. find the role "superadmin"
  const role = await Role.findOne({ name: "superadmin" });
  if (!role) {
    console.error("superadmin role is not found. Run the seedRoles.js");
    process.exit(1);
  }

  // 2. Check if user with this email already exists
  const existing = await User.findOne({ email: "superadmin@example.com" });
  if (existing) {
    console.log("This email already exists:", existing.email);
    return;
  }

  // 3. Hash the password
  const plainPassword = process.env.SUPERADMIN_PASS; // get password from env
  if (!plainPassword) {
    console.error("Please set SUPERADMIN_PASS in .env file");
    process.exit(1);
  }
  const hashed = await bcrypt.hash(plainPassword, 10);

  // 4. Create the user
  const user = await User.create({
    username: "superadmin",
    email: "superadmin@example.com",
    password: hashed,
    status: "active", // active status
    // avatar: 'https://example.com/avatar.png', // optional
    // phone: '+1234567890', // optional
    role: role._id,
  });
  console.log("Superadmin created", user.email);
  console.log("   login:", user.username);
  console.log("   password:", plainPassword);
}

// function to delete the super-admin user
// This function deletes the super-admin user from the database
async function deleteSuperAdmin() {
  const res = await User.deleteOne({ username: "superadmin" });
  if (res.deletedCount) {
    console.log("Superadmin deleted");
  } else {
    console.log("Superadmin not found");
  }
}

// Main function to run the script
// This function connects to the database and runs the create or delete function
(async () => {
  await connectDB();

  const action = process.argv[2]; // 'create' or 'delete'

  if (action === "create") {
    await createSuperAdmin();
  } else if (action === "delete") {
    await deleteSuperAdmin();
  } else {
    console.log("Usage:");
    console.log(
      "  node seeders/seedSuperAdmin.js create   # Create super-admin"
    );
    console.log(
      "  node seeders/seedSuperAdmin.js delete   # Delete super-admin"
    );
  }

  mongoose.disconnect();
})();
