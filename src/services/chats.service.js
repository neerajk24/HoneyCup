import Conversation from "../models/chats.model.js";

class ChatService {
  async sendMessage(conversationId, message) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    conversation.messages.push(message);
    return conversation.save();
  }

  async getMessages(conversationId) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    return conversation.messages;
  }

  async editMessage(conversationId, messageId, newContent) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    const message = conversation.messages.id(messageId);
    if (!message) {
      throw new Error("Message not found");
    }
    message.content = newContent;
    message.timestamp = Date.now();
    return conversation.save();
  }

  async deleteMessage(conversationId, messageId) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    conversation.messages.id(messageId).remove();
    return conversation.save();
  }
}

export default new ChatService();
