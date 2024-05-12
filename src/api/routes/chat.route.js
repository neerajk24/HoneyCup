// src/api/routes/chat.route.js
// Defines the API endpoints for sending, deleting, editing, and retrieving messages.

import express from 'express';
import { sendMessage, deleteMessage, editMessage, getMessage } from '../controllers/chat.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *                 description: The ID of the message sender.
 *               recipient:
 *                 type: string
 *                 description: The ID of the message recipient.
 *               content:
 *                 type: string
 *                 description: The content of the message.
 *               messageType:
 *                 type: string
 *                 description: The type of message (e.g., text, image).
 *     responses:
 *       201:
 *         description: Message sent successfully.
 *       400:
 *         description: Error sending message.
 */
router.post('/send', sendMessage);

/**
 * @swagger
 * /api/chat/messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to delete.
 *     responses:
 *       200:
 *         description: Message deleted successfully.
 *       404:
 *         description: Message not found.
 */
router.delete('/messages/:messageId', deleteMessage);

/**
 * @swagger
 * /api/chat/messages/{messageId}:
 *   put:
 *     summary: Edit/Update a message
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to edit/update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The updated content of the message.
 *     responses:
 *       200:
 *         description: Message edited/updated successfully.
 *       404:
 *         description: Message not found.
 */
router.put('/messages/:messageId', editMessage);

/**
 * @swagger
 * /api/chat/messages/{messageId}:
 *   get:
 *     summary: Get a message by ID
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to retrieve.
 *     responses:
 *       200:
 *         description: Message retrieved successfully.
 *       404:
 *         description: Message not found.
 */
router.get('/messages/:messageId', getMessage);

export default router;
