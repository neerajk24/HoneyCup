// src/api/controllers/chat.controller.js
//

import Message from '../../models/message.model.js';
import User from '../../models/user.model.js';
import { analyzeMessage } from '../../services/nlp.service.js'; // Import NLP service

const sendMessage = async (req, res) => {
    try {
        const { sender, recipient, content, messageType, isImage } = req.body;
        
        // Analyze message content using NLP
        const analysisResult = await analyzeMessage(content, isImage);
        
        // Check for inappropriate content in text or images
        if (analysisResult.isInappropriate || analysisResult.isBadImage) {
            // Handle inappropriate message or image
            return res.status(400).json({ error: 'Inappropriate content detected' });
        }

        // Find sender and recipient users
        const [senderUser, recipientUser] = await Promise.all([
            User.findById(sender),
            User.findById(recipient)
        ]);

        // Check if both users have agreed to continue the chat
        if (senderUser && recipientUser && senderUser.continueChat && recipientUser.continueChat) {
            // Chat is persisted indefinitely
            // Create and save message to database
            const message = await Message.create({ sender, recipient, content, messageType });
            return res.status(201).json({ message });
        } else {
            // Chat is not persisted
            // Set message expiration time to 24 hours
            const expirationTime = new Date(Date.now() + (24 * 60 * 60 * 1000));
            const message = await Message.create({ sender, recipient, content, messageType, expires: expirationTime });
            return res.status(201).json({ message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { sendMessage };
