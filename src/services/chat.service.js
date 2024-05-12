// src/services/chat.service.js
 

import Message from '../models/message.model.js';
import User from '../models/user.model.js';

/**
 * Send a message from one user to another.
 * @param {string} senderId - The ID of the user sending the message.
 * @param {string} recipientId - The ID of the user receiving the message.
 * @param {string} content - The content of the message.
 * @returns {Promise<object>} The created message object.
 */
export const sendMessage = async (senderId, recipientId, content) => {
    try {
        // Check if sender and recipient exist
        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);

        if (!sender || !recipient) {
            throw new Error('Sender or recipient not found');
        }

        // Create and save message to database
        const message = new Message({ sender: senderId, receiver: recipientId, content });
        await message.save();

        return message;
    } catch (error) {
        throw new Error('Error sending message: ' + error.message);
    }
};
