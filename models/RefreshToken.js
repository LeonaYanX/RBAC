// backend/models/RefreshToken.js
const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
  token: {
    // сам JWT refresh токен
    type: String,
    required: true,
    unique: true,
  },
  user: {
    // на какого пользователя выдан
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expires: {
    // когда истекает (Date)
    type: Date,
    required: true,
  },
  createdAt: {
    // дата создания — для статистики
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
