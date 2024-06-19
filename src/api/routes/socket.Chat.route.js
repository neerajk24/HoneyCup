// /routes/chatRoutes.js
import express from "express";
const router = express.Router();
import { getConversationid , getUsernames , getUnreadmsg , markMsgRead , generateSasurl} from "../controllers/socket.Chat.controller.js";

router.post('/chats/getconvoId', getConversationid);
router.get('/chats/getUsernames', getUsernames);
router.get('/chats/getUnreadmsg/:username', getUnreadmsg);
router.post('/chats/markMsgRead', markMsgRead);
router.get('/chats/generateSasurl', generateSasurl);

export default router;