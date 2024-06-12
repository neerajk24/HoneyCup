import Conversation from "../models/chats.model.js";
import mongoose from 'mongoose';

let ConnectedSockets = [
    // {Userid , socketId}
]

export const ChatSocket = (io) => {
    io.on('connection', (socket) => {
        const Userid = socket.handshake.auth.userid;
        ConnectedSockets.push({
            socketId: socket.id,
            Userid
        })
        console.log(`${Userid} got connected..`);

        socket.on('joinRoom', async ({ userId, conversationId }) => {
            console.log(`User ${userId} trying to join the room ${conversationId}`);

            socket.join(conversationId);
            // Convert the conversationId string to an ObjectId
            const conversationObjectId = new mongoose.Types.ObjectId(conversationId);

            const chat = await Conversation.findOne({ _id: conversationObjectId });
            if (chat) {
                socket.emit('previousMessages', chat.messages);
            }
        });

        socket.on('sendMessages', async ({ conversationId, message }) => {
            console.log(`${conversationId} is trying to send ${message}`);  
            io.to(conversationId).emit('recieveMessage', message);

            // Convert the conversationId string to an ObjectId
            const conversationObjectId = new mongoose.Types.ObjectId(conversationId);

            const chat = await Conversation.findOne({ _id: conversationObjectId });
            if (chat) {
                chat.messages.push(message);
                await chat.save();
            } else {
                console.log("Error in sending messages Chat not found!");
            }
            //Case of chat not present is excluded right now.
        })

        socket.on('disconnect', () => {
            ConnectedSockets = ConnectedSockets.filter((soc) => soc.Userid !== Userid);
            console.log(socket.id + " disconnected");
        })
    })
}