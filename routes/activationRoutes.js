const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const { activate } = require("../controllers/activationController");

/**
 * @module routes/activation
 * @description routes for user account activation
 */

/**
 * @swagger
 * /activate/{token}:
 *   post:
 *     summary: Activate user account
 *     description: Activate a user account using the activation token sent via email.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Activation token received via email.
 *     responses:
 *       200:
 *         description: Account successfully activated.
 *       400:
 *         description: Invalid or expired token.
 *       500:
 *         description: Internal server error.
 */
router.post("/activate/:token", asyncHandler(activate));

module.exports = router;
