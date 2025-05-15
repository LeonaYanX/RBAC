// backend/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

// Middleware из вашего authMiddleware.js
const { authenticate } = require("../middleware/authMiddleware");
// Новое middleware из roleMiddleware.js
const { allowRoles } = require("../middleware/roleMiddleware");

// Контроллеры
const {
  getUserList,
  getUser,
  deleteUser,
  assignRoleToUser,
} = require("../controllers/userController");

/**
 * Проверка доступа по ролям.
 * authenticate — проверяет JWT и заполняет req.user.roleName.
 */

// 1. GET /api/users — получить список всех
router.get("/", authenticate, asyncHandler(getUserList));

// 2. GET /api/users/:id — получить одного
router.get("/:id", authenticate, asyncHandler(getUser));

// 3. DELETE /api/users/:id — удалить
router.delete(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  asyncHandler(deleteUser)
);

// 4. PUT /api/users/:id/role — назначить роль
router.put(
  "/:id/role",
  authenticate,
  allowRoles("superadmin"), // только супер-админ может менять роли
  asyncHandler(assignRoleToUser)
);

module.exports = router;
