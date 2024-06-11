// src/api/routes/chats.router.js

import express from "express";
import chatController from "../controllers/chats.controller.js";
import chatsMiddleware from "../middlewares/chats.middleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the message
 *         sender:
 *           type: string
 *           description: The ID of the message sender
 *         receiver:
 *           type: string
 *           description: The ID of the message recipient
 *         content:
 *           type: string
 *           description: The content of the message
 *         content_type:
 *           type: string
 *           description: The type of message (e.g., text, file)
 *         content_link:
 *           type: string
 *           description: The link to the file if content_type is 'file'
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The time the message was sent
 *         is_read:
 *           type: boolean
 *           description: Indicates if the message was read
 *         is_appropriate:
 *           type: boolean
 *           description: Indicates if the message is appropriate
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * tags:
 *   name: Chat
 *   description: The chat managing API
 */

/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *                 description: The ID of the message sender
 *               receiver:
 *                 type: string
 *                 description: The ID of the message recipient
 *               content:
 *                 type: string
 *                 description: The content of the message
 *               content_type:
 *                 type: string
 *                 description: The type of message (e.g., text, file)
 *               content_link:
 *                 type: string
 *                 description: The link to the file if content_type is 'file'
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Error sending message
 */
router.post(
  "/:conversationId/send",
  chatsMiddleware.checkConversation,
  chatController.sendMessage
);

/**
 * @swagger
 * /api/chat/messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to delete
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 */
router.delete(
  "/:conversationId/messages/:messageId",
  chatsMiddleware.checkConversation,
  chatController.deleteMessage
);

/**
 * @swagger
 * /api/chat/messages/{messageId}:
 *   put:
 *     summary: Edit/Update a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to edit/update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The updated content of the message
 *     responses:
 *       200:
 *         description: Message edited/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Message not found
 */
router.put(
  "/:conversationId/messages/:messageId",
  chatsMiddleware.checkConversation,
  chatController.editMessage
);

/**
 * @swagger
 * /api/chat/messages/{messageId}:
 *   get:
 *     summary: Get a message by ID
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to retrieve
 *     responses:
 *       200:
 *         description: Message retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Message not found
 */
router.get(
  "/:conversationId/messages/:messageId",
  chatsMiddleware.checkConversation,
  chatController.getMessage
);

export default router;
