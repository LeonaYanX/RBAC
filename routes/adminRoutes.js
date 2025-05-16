const express = require("express");
const asyncHandler = require("express-async-handler");
const { createUserRules, validate } = require("../validators/adminValidators");
const router = express.Router();

const { authenticate, authorize } = require("../middleware/authMiddleware");
const { createUser } = require("../controllers/adminController");

/**
 * @module routes/admin
 * @description Routes for admin actions
 */

/**
 * @swagger
 * /api/admin/create-user:
 *   post:
 *     summary: Create a new user
 *     description: >
 *       Creates a new user and sends an activation email.
 *       Requires admin privileges.
 *      The user will receive an email with an activation link.
 *       The link will be valid for 24 hours.
 *      The user will be created with an inactive status.
 * 
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - roleName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               roleName:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully and email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully and email sent.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Unauthorized access.
 *       403:
 *         description: Forbidden access.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/create-user",
  authenticate,
  authorize("role.assign"),
  createUserRules,
  validate,
  asyncHandler(createUser)
);

module.exports = router;
