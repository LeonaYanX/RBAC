const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { loginRules, validate } = require("../validators/authValidators");

const {
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

/**
 * @module routes/auth
 * @description Routes for authentication and password recovery
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentication of a user.
 *     description: >
 *      Requires email and password to authenticate the user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User credentials.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful authentication.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Invalid email or password.
 *       500:
 *         description: Internal server error.
 */
router.post("/login", loginRules, validate, asyncHandler(login));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token.
 *     description: >
 *       Accepts a refresh token and returns a new access token.
 *     tags:
 *       - Аuthentication
 *     requestBody:
 *       description: Refresh token for generating a new access token.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your_refresh_token
 *     responses:
 *       200:
 *         description: New access token generated successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Invalid or expired refresh token.
 *       500:
 *         description: Internal server error.
 */
router.post("/refresh", asyncHandler(refreshToken));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user.
 *     description: >
 *       Accepts a refresh token and invalidates it.
 *     tags:
 *       - Аутентификация
 *     requestBody:
 *       description: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your_refresh_token
 *     responses:
 *       200:
 *         description: Logout successful.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Invalid or expired refresh token.
 *       500:
 *         description: Internal server error.
 */
router.post("/logout", asyncHandler(logout));

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset.
 *     description: >
 *       Accepts an email address and sends a password reset link to the user.
 *     tags:
 *       - Password recovery
 *     requestBody:
 *       description: Email address of the user requesting password reset.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent successfully.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/forgot-password", asyncHandler(forgotPassword));

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset user password.
 *     description: >
 *       Accepts a password reset token and a new password to reset the user's password.
 *     tags:
 *       - Password recovery
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token received via email.
 *     requestBody:
 *       description: New password for the user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: new_password123
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Invalid or expired token.
 *       500:
 *         description:  Internal server error.
 */
router.post("/reset-password/:token", asyncHandler(resetPassword));

module.exports = router;
