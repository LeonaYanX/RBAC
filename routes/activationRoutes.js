// backend/routes/activationRoutes.js
const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const { activate } = require("../controllers/activationController");

// API-эндпоинт — POST для обновления профиля:
router.post("/activate/:token", asyncHandler(activate));

module.exports = router;
