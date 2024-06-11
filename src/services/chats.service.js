// src/services/chats.service.js

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
      const uploadResult = await uploadFileToAzureBlob(
        message.content_link,
        message.message_id
      );
      message.content_link = uploadResult.blobUrl;
    }

    conversation.messages.push(message);
    return conversation.save();
  }

  async editMessage(conversationId, messageId, newMessage) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const message = conversation.messages.id(messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    if (newMessage.content_type !== "text" && newMessage.content_link) {
      const uploadResult = await uploadFileToAzureBlob(
        newMessage.content_link,
        message.message_id
      );
      newMessage.content_link = uploadResult.blobUrl;
      await deleteFileById(message.content_link);
    }

    message.content = newMessage.content;
    message.content_type = newMessage.content_type;
    message.content_link = newMessage.content_link;
    message.timestamp = Date.now();

    return conversation.save();
  }

  async deleteMessage(conversationId, messageId) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const message = conversation.messages.id(messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    if (message.content_type !== "text") {
      await deleteFileById(message.content_link);
    }

    message.remove();
    return conversation.save();
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
