// /routes/chatRoutes.js
import express from "express";
const router = express.Router();
import { getConversationid , getUsernames } from "../controllers/socket.Chat.controller.js";

router.post('/chats/getconvoId', getConversationid);
router.get('/chats/getUsernames', getUsernames);

export default router;