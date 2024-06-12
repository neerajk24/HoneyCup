import Conversation from "../../models/chats.model.js";
import User from "../../models/user.model.js";

export const getConversationid = async (req, res) => {
    const { userId1, userId2 } = req.body;
    console.log(`Users have arrived ${userId1} and ${userId2}`);
    if (!userId1 || !userId2) {
        res.status(400).json({ message: "Both the userid's are required" });
    }
    try {
        console.log("here");
        let conversation = await Conversation.findOne({ participants: { $all: [userId1, userId2] } });
        if (!conversation) {
            conversation = new Conversation({
                participants: [userId1, userId2],
                messages: []
            })
            await conversation.save();
        }
        console.log(`Conversation ID found : ${conversation._id}`);
        res.status(200).json({ conversationId: conversation._id })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

export const getUsernames = async (req, res) => {
    let Ids = [];
    try {
        const users = await User.find({});
        for (let index = 0; index < users.length; index++) {
            Ids.push(users[index].username);
        }
        res.status(200).json({usernames : Ids});
    } catch (error) {
        res.status(500).json({message: "Internal Server error" , error : error.message});
    }
}