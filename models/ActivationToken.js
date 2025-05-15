// backend/models/ActivationToken.js
const mongoose = require("mongoose");

const ActivationTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // по одному токену на пользователя
    },
    token: {
      type: String,
      required: true,
      unique: true, // токен должен быть уникальным
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
); // добавляем поля createdAt и updatedAt

module.exports = mongoose.model("ActivationToken", ActivationTokenSchema);
