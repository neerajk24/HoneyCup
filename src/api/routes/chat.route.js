// file path: /src/api/routes/chat.route.js

import express from "express";
import { createChatController } from "../controllers/chat.controller.js";
import * as nlpService from "../../services/nlp.service.js"; // Correct import
import Message from "../../models/message.model.js";
import User from "../../models/user.model.js";

const router = express.Router();

// Create the chat controller instance with the necessary dependencies
const chatController = createChatController({ nlpService, Message, User });

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
 *         messageType:
 *           type: string
 *           description: The type of message (e.g., text, image)
 *         isImage:
 *           type: boolean
 *           description: Indicates if the message is an image
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The time the message was sent
 *         seenBy:
 *           type: array
 *           items:
 *             type: string
 *           description: List of users who have seen the message
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
 *               messageType:
 *                 type: string
 *                 description: The type of message (e.g., text, image)
 *               isImage:
 *                 type: boolean
 *                 description: Indicates if the message is an image
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
router.post("/send", chatController.sendMessage);

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
router.delete("/messages/:messageId", chatController.deleteMessage);

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
router.put("/messages/:messageId", chatController.editMessage);

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
router.get("/messages/:messageId", chatController.getMessage);

export default router;
