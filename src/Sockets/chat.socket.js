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
        socket.on('joinRoom', async ({ userId, conversationId }) => {
            socket.join(conversationId);
            console.log(`User ${userId} join the room ${conversationId}`);
            const chat = await Conversation.findOne({ _id: new mongoose.Types.ObjectId(conversationId) }); 
            if (chat) {
                socket.emit('previousMessages', chat.messages);
            }
        });
        socket.on('sendMessages', async ({ conversationId, message }) => {
            io.to(conversationId).emit('recieveMessage', message);
            const chat = await Conversation.findOne({ _id: new mongoose.Types.ObjectId(conversationId) }); 
            if (chat) {
                chat.messages.push(message);
                await chat.save();
            }
            else {
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