// src/api/routes/blocked.route.js

import express from 'express';
import { addBlockedUser, removeBlockedUser, getBlockedUsers } from '../controllers/blocked.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/blocked/block:
 *   post:
 *     summary: Block a user
 *     tags: [Blocked Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user performing the block action.
 *               blockedUserId:
 *                 type: string
 *                 description: The ID of the user to be blocked.
 *     responses:
 *       200:
 *         description: User blocked successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/block', addBlockedUser);

/**
 * @swagger
 * /api/blocked/unblock:
 *   post:
 *     summary: Unblock a user
 *     tags: [Blocked Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user performing the unblock action.
 *               blockedUserId:
 *                 type: string
 *                 description: The ID of the user to be unblocked.
 *     responses:
 *       200:
 *         description: User unblocked successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/unblock', removeBlockedUser);

/**
 * @swagger
 * /api/blocked/blocked/{userId}:
 *   get:
 *     summary: Get list of blocked users
 *     tags: [Blocked Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose blocked users are to be retrieved.
 *     responses:
 *       200:
 *         description: List of blocked users retrieved successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/blocked/:userId', getBlockedUsers);

export default router;
