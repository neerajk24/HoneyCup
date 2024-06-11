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

const getMessage = async (req, res) => {
  try {
    const conversation = req.conversation;
    const message = conversation.messages.id(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  getMessage,
};
