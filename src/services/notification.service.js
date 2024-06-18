// src/services/notification.service.js

import admin from "../config/firebaseAdmin.config.js";
import Conversation from "../models/chats.model.js";
import path from "path";

class NotificationService {
  async sendUnreadMessagesNotification(conversationId) {
    try {
      const conversation = await Conversation.findById(conversationId).populate(
        "participants",
        "fcmToken"
      );
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      const unreadMessages = conversation.messages.filter(
        (msg) => !msg.is_read
      );
      const unreadCount = unreadMessages.length;
      const latestMessage = unreadMessages[unreadMessages.length - 1];

      if (!latestMessage) {
        console.log("No unread messages found.");
        return;
      }

      const senderId = latestMessage.sender_id;
      const messagePreview =
        latestMessage.content_type === "file"
          ? path.basename(latestMessage.content_link)
          : latestMessage.content.substring(0, 15);

      const tokens = conversation.participants
        .map((p) => p.fcmToken)
        .filter(Boolean);
      if (tokens.length === 0) {
        console.log("No FCM tokens found.");
        return;
      }

      const messagePayload = {
        notification: {
          title: "New Unread Message",
          body: `You have ${unreadCount} unread message(s) from ${senderId}`,
        },
        data: {
          click_action: "NOTIFICATION_CLICK",
          senderId: senderId,
          messagePreview: messagePreview,
        },
        tokens: tokens,
      };

      const response = await admin.messaging().sendMulticast(messagePayload);
      console.log("Notification sent:", response);
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }
}

export default new NotificationService();

