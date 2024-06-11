// /routes/chatRoutes.js
import express from "express";
const router = express.Router();
import { getChatbyid } from "../controllers/socket.Chat.controller.js";

router.get('/chats/:conversationId', getChatbyid);

export default router;