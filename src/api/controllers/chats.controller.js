// src/api/controllers/chats.controller.js

import chatService from "../../services/chats.service.js";

const sendMessage = async (req, res) => {
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
};

const getMessages = async (req, res) => {
  try {
    const messages = await chatService.getMessages(req.params.conversationId);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editMessage = async (req, res) => {
  try {
    const newMessage = req.body;
    const updatedConversation = await chatService.editMessage(
      req.params.conversationId,
      req.params.messageId,
      newMessage
    );
    res.status(200).json(updatedConversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const updatedConversation = await chatService.deleteMessage(
      req.params.conversationId,
      req.params.messageId
    );
    res.status(200).json(updatedConversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

async function getMessage(req, res) {
  try {
    const { conversationId, messageId } = req.params;
    const conversation = await chatService.getConversation(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const message = conversation.messages.find(
      (msg) => msg._id.toString() === messageId // Compare ObjectIDs as strings
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  getMessage,
};
