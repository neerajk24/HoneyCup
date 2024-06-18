// /routes/chatRoutes.js
import express from "express";
const router = express.Router();
import { getConversationid , getUsernames , getUnreadmsg , markMsgRead , generateSastoken} from "../controllers/socket.Chat.controller.js";

router.post('/chats/getconvoId', getConversationid);
router.get('/chats/getUsernames', getUsernames);
router.get('/chats/getUnreadmsg/:username', getUnreadmsg);
router.post('/chats/markMsgRead', markMsgRead);
router.get('/chats/generateSastoken', generateSastoken);

export default router;