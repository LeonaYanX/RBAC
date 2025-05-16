const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

// Middleware for autentication and role authorization
const { authenticate } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// controllers
const {
  getUserList,
  getUser,
  deleteUser,
  assignRoleToUser,
} = require("../controllers/userController");

/**
 * @module routes/users
 * @description Routes for user management
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get list of all users.
 *     description: >
 *       Retrieves a list of all users. Requires authentication.
 *       The list includes all users in the system.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users successfully retrieved.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
router.get("/", authenticate, asyncHandler(getUserList));

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID.
 *     description: >
 *       Retrieves a single user by their ID. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User successfully retrieved.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", authenticate, asyncHandler(getUser));

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID.
 *     description: >
 *      Deletes a user by their ID. Requires authentication and admin privileges.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User successfully deleted.
 *       401:
 *         description: Unauthorized access.
 *       403:
 *         description: Forbidden access.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.delete(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  asyncHandler(deleteUser)
);

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     summary: Assign role to user.
 *     description: >
 *      Assigns a new role to a user by their ID. Requires authentication and admin privileges.
 *      The role must be one of the predefined roles in the system.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Role to assign to the user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Role successfully assigned to user.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Unauthorized access.
 *       403:
 *         description: Forbidden access.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.put(
  "/:id/role",
  authenticate,
  allowRoles("superadmin"),
  asyncHandler(assignRoleToUser)
);

module.exports = router;
