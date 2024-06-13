// src/services/notification.service.js

import admin from "../config/firebaseAdmin.config.js";
import Conversation from "../models/chats.model.js"; // Assuming your conversation model
import path from "path";

class NotificationService {
  async sendUnreadMessagesNotification(conversationId) {
    try {
      const conversation = await Conversation.findById(conversationId);
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
        tokens: conversation.participants.map((p) => p.fcmToken), // Assuming participants have fcmToken field
      };

      const response = await admin.messaging().sendMulticast(messagePayload);
      console.log("Notification sent:", response);
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error; // Propagate error to handle in the calling function
    }
  }
}

export default new NotificationService();
