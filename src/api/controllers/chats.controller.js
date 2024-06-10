import express from "express";
import chatService from "../../services/chats.service.js";

const router = express.Router();

// Middleware to check for valid conversation
async function checkConversation(req, res, next) {
  const conversationId = req.params.conversationId;
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }
  req.conversation = conversation;
  next();
}

router.post("/:conversationId/messages", async (req, res) => {
  try {
    const message = req.body;
    const savedConversation = await chatService.sendMessage(
      req.params.conversationId,
      message
    );
    res.status(201).json(savedConversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:conversationId/messages", async (req, res) => {
  try {
    const messages = await chatService.getMessages(req.params.conversationId);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:conversationId/messages/:messageId", async (req, res) => {
  try {
    const newContent = req.body.content;
    const updatedConversation = await chatService.editMessage(
      req.params.conversationId,
      req.params.messageId,
      newContent
    );
    res.status(200).json(updatedConversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:conversationId/messages/:messageId", async (req, res) => {
  try {
    const updatedConversation = await chatService.deleteMessage(
      req.params.conversationId,
      req.params.messageId
    );
    res.status(200).json(updatedConversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
