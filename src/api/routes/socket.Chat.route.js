// /routes/chatRoutes.js
import express from "express";
const router = express.Router();
import { getChatbyid , createConversation } from "../controllers/socket.Chat.controller.js";

router.get('/chats/:conversationId', getChatbyid);
router.post('/chats/createConvo', createConversation);

export default router;