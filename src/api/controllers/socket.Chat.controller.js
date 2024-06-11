import Conversation from "../../models/chats.model.js";

export const getChatbyid = async (req, res) => {
    const { conversationId } = req.params;
    try {
        const messages = await Conversation.findById(conversationId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({message : "Internal Server Error" , error : error.message})
    }
}