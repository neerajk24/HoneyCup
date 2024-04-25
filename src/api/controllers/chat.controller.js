// src/api/controllers/chat.controller.js

import Message from '../../models/message.model.js';
import { analyzeMessage } from '../../services/nlp.service.js'; // Import NLP service

// Controller functions
const sendMessage = async (req, res) => {
    try {
        // Create and save message to database
        const { sender, recipient, content, messageType } = req.body;
        
        // Analyze message content using NLP
        const analysisResult = await analyzeMessage(content);
        
        // Check for inappropriate content
        if (analysisResult.isInappropriate) {
            // Handle inappropriate message
            return res.status(400).json({ error: 'Inappropriate content detected' });
        }

        const message = new Message({ sender, recipient, content, messageType });
        await message.save();

        // Emit message to recipient's socket for real-time update
        req.io.to(recipient).emit('newMessage', message);

        res.status(201).json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const flagMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        message.flagged = true;
        await message.save();

        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add more controller functions as needed

export { sendMessage, flagMessage };
