import Conversation from "../models/chats.model.js";

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
            const chat = await Conversation.findById(conversationId);
            if (chat) {
                socket.emit('previousMessages', chat.messages);
            }
        });
        socket.on('sendMessages', async ({ conversationId, message }) => {
            io.to(conversationId).emit('recieveMessage', message);
            const chat = await Conversation.findById(conversationId);
            if (chat) {
                chat.messages.push(message);
                await chat.save();
            }
            else {
                const newChat = new Conversation({
                    _id: conversationId,
                    participants: [message.sender_id, message.receiver_id],
                    messages: [message],
                });
                await newChat.save();
            }
        })
        socket.on('disconnect', ()=>{
            ConnectedSockets = ConnectedSockets.filter((soc)=>soc.Userid!==Userid);
            console.log(socket.id + " disconnected");
        })
    })
}