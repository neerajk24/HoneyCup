import express from 'express';
import { addFriend, removeFriend, getFriends } from '../controllers/friends.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/friends/add:
 *   post:
 *     summary: Add a friend
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user adding a friend.
 *               friendId:
 *                 type: string
 *                 description: The ID of the user to be added as a friend.
 *     responses:
 *       200:
 *         description: Friend added successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/add', addFriend);

/**
 * @swagger
 * /api/friends/remove:
 *   delete:
 *     summary: Remove a friend
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user removing a friend.
 *               friendId:
 *                 type: string
 *                 description: The ID of the user to be removed from friends.
 *     responses:
 *       200:
 *         description: Friend removed successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/remove', removeFriend);

/**
 * @swagger
 * /api/friends/{userId}:
 *   get:
 *     summary: Get list of friends
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve friends.
 *     responses:
 *       200:
 *         description: List of friends retrieved successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:userId', getFriends);

export default router;
