// src/services/chats.service.js

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Conversation from "../models/chats.model.js";
import { uploadFileToAzureBlob, deleteFileById } from "./azureBlob.service.js";

class ChatService {
  async sendMessage(conversationId, message) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Ensure message_id is present
    if (!message.message_id) {
      message.message_id = new mongoose.Types.ObjectId().toString();
    }

    // Check if message is a file
    if (message.content_type !== "text" && message.content_link) {
      // Read the file content
      const buffer = fs.readFileSync(message.content_link);
      const fileName = path.basename(message.content_link);

      // Upload the file content
      const uploadResult = await uploadFileToAzureBlob(buffer, fileName);

      // Update the message content_link with the uploaded file URL
      message.content_link = uploadResult.blobUrl;
    }

    conversation.messages.push(message);
    await conversation.save();
    return conversation;
  }

  async editMessage(conversationId, messageId, newMessage) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const message = conversation.messages.find(
      (msg) => msg.message_id === messageId
    );
    if (!message) {
      throw new Error("Message not found");
    }

    if (newMessage.content_type !== "text" && newMessage.content_link) {
      const buffer = fs.readFileSync(newMessage.content_link);
      const fileName = path.basename(newMessage.content_link);
      const uploadResult = await uploadFileToAzureBlob(buffer, fileName);
      newMessage.content_link = uploadResult.blobUrl;
      await deleteFileById(message.content_link);
    }

    message.content = newMessage.content;
    message.content_type = newMessage.content_type;
    message.content_link = newMessage.content_link;
    message.timestamp = Date.now();

    await conversation.save();
    return conversation;
  }

  async deleteMessage(conversationId, messageId) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const messageIndex = conversation.messages.findIndex(
      (msg) => msg.message_id === messageId
    );
    if (messageIndex === -1) {
      throw new Error("Message not found");
    }

    if (conversation.messages[messageIndex].content_type !== "text") {
      await deleteFileById(conversation.messages[messageIndex].content_link);
    }

    conversation.messages.splice(messageIndex, 1);
    await conversation.save();

    return conversation;
  }

  async getMessages(conversationId) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    return conversation.messages;
  }
}

export default new ChatService();
