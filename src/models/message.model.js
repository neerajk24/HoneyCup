// src/models/message.model.js
// Defines the schema for messages exchanged between users

import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isImage: {
    type: Boolean,
    default: false
  },
  seenBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
