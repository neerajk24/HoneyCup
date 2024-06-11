// src/models/chats.model.js

import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
  message_id: { type: String, required: true, unique: true },
  sender_id: { type: String, required: true },
  receiver_id: { type: String, required: true },
  content: { type: String, default: null },
  content_type: { type: String, enum: ["text", "file"], required: true },
  content_link: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
  is_read: { type: Boolean, default: false },
  is_appropriate: { type: Boolean, default: true },
});

messageSchema.virtual("detected_content_type").get(function () {
  if (this.content_type === "file" && this.content_link) {
    const ext = this.content_link.split(".").pop();
    return `.${ext}`;
  }
  return "text";
});

const conversationSchema = new Schema({
  _id: { type: String, required: true, unique: true },
  participants: [{ type: String, required: true }],
  messages: [messageSchema],
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;