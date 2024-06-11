// src/middleware/chats.middleware.js

import Conversation from "../models/chats.model.js";

async function checkConversation(req, res, next) {
  const conversationId = req.params.conversationId;
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    req.conversation = conversation;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export default {
  checkConversation,
};
