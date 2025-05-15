const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
  email: { type: String, required: true, unique: true },
  avatar: {
    // ссылка на изображение аватара
    type: String,
    default: "",
  },
  phone: { type: String, default: "" },
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  role: {
    // ссылка на Role
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
