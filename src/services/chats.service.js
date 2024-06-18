// src/services/chats.service.js

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import axios from "axios";
import Conversation from "../models/chats.model.js";
import { uploadFileToAzureBlob, deleteFileById } from "./azureBlob.service.js";
import NotificationService from "./notification.service.js";

class ChatService {
  async sendMessage(conversationId, message) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Check if message is a file
    if (message.content_type !== "text" && message.content_link) {
      // Read the file content
      // const buffer = fs.readFileSync(message.content_link);
      // const fileName = path.basename(message.content_link);
      const response = await axios.get(message.content_link, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data);
      const fileName = path.basename(message.content_link);

      // Upload the file content
      const uploadResult = await uploadFileToAzureBlob(buffer, fileName);

      // Update the message content_link with the uploaded file URL
      message.content_link = uploadResult.blobUrl;
      console.log(`chats service ${message.content_link}`);
    }
    message.is_read = false;

    conversation.messages.push(message);
    await conversation.save();

    // Send notification
    // await NotificationService.sendUnreadMessagesNotification(conversationId);

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

  async getConversation(conversationId) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    return conversation;
  }

  async getUnreadMessagesCount(conversationId) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const unreadCount = conversation.messages.filter(
      (message) => !message.is_read
    ).length;
    return unreadCount;
  }

  async getUnreadMessagesCountForPair(userId1, userId2) {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId1, userId2] },
    });

    if (!conversation) {
      return 0;
    }

    const unreadCount = conversation.messages.filter(
      (message) => !message.is_read && message.receiver_id === userId1
    ).length;

    return unreadCount;
  }
}

export default new ChatService();
