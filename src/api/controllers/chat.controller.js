// src/api/controllers/chat.controller.js

export function createChatController({ nlpService, Message, User }) {
  return {
    async sendMessage(req, res) {
      try {
        const { sender, receiver, content, messageType, isImage } = req.body;

        // Analyze the message content using the NLP service
        const analysis = await nlpService.analyzeMessage(content);

        // Check for inappropriate content or bad images
        if (analysis.isInappropriate || analysis.isBadImage) {
          return res
            .status(400)
            .json({ error: "Inappropriate content detected" });
        }

        // Create the message in the database
        const message = await Message.create({
          sender,
          receiver,
          content,
          messageType,
          isImage,
        });

        // Respond with the created message
        res.status(201).json({ message });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    async deleteMessage(req, res) {
      try {
        const { messageId } = req.params;

        // Delete the message by ID
        const message = await Message.findByIdAndDelete(messageId);

        // If the message doesn't exist, respond with a 404 error
        if (!message) {
          return res.status(404).json({ error: "Message not found" });
        }

        // Respond with a success message
        res.status(200).json({ message: "Message deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    async editMessage(req, res) {
      try {
        const { messageId } = req.params;
        const { content } = req.body;

        // Update the message content by ID
        const message = await Message.findByIdAndUpdate(
          messageId,
          { content },
          { new: true }
        );

        // If the message doesn't exist, respond with a 404 error
        if (!message) {
          return res.status(404).json({ error: "Message not found" });
        }

        // Respond with the updated message
        res.status(200).json(message);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    async getMessage(req, res) {
      try {
        const { messageId } = req.params;

        // Find the message by ID
        const message = await Message.findById(messageId);

        // If the message doesn't exist, respond with a 404 error
        if (!message) {
          return res.status(404).json({ error: "Message not found" });
        }

        // Respond with the found message
        res.status(200).json(message);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
  };
}
