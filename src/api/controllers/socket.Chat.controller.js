import Conversation from "../../models/chats.model.js";

export const getChatbyid = async (req, res) => {
    const { conversationId } = req.params;
    try {
        const messages = await Conversation.findOne({ _id: conversationId });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

export const createConversation = async (req, res) => {
    const { userId1, userId2 } = req.body;
    try {
        const newconvo = new Conversation({
            participants: [userId1, userId2],
            messages: []
        })
        await newconvo.save();
        res.status(200).json({message : "New chat created!"});
    } catch (error) {
        res.status(500).json({message : "Internal server error" , error : error.message});
    }
}