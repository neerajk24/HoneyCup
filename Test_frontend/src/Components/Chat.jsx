import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
const URL = "http://192.168.81.13:3000";

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState(''); // Replace with the actual user ID
    const [conversationId, setConversationId] = useState(''); // Replace with the actual conversation ID
    const [userList, setUserlist] = useState([{ Userid: 'sfakkflskfk', socketId: 'sdgadfgd' }]);
    useEffect(() => {
        const socket = io(URL, {
            auth: {
                Userid: userId,
            }
        });
        // Join the conversation room
        socket.emit('joinRoom', { userId, conversationId });

        // Listen for incoming messages
        socket.on('recieveMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // Listen for previous messages
        socket.on('previousMessages', (previousMessages) => {
            setMessages(previousMessages);
        });

        // Clean up the event listeners when the component unmounts
        return () => {
            socket.off('recieveMessage');
            socket.off('previousMessages');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() !== '') {
            const newMessage = {
                sender_id: userId,
                receiver_id: '', // Replace with the receiver's ID if needed
                content: message,
                content_type: 'text',
                timestamp: new Date(),
            };

            // Send the message to the server
            socket.emit('sendMessages', { conversationId, message: newMessage });

            setMessage('');
        }
    };

    return (
        <div style={{display : 'flex' , flexDirection : 'column', justifyContent: 'center' , alignItems : 'center'}}>
            <div style={{display : 'flex' , justifyContent: 'center' , alignItems : 'center'}}>
                <div style={{ border: '2px solid red' }}>
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <span>{msg.sender_id}: </span>
                            <span>{msg.content}</span>
                        </div>
                    ))}
                </div >
                <div style={{ border: '2px solid blue', width : '700px' , height : '100%'}}>
                    {
                        userList.map((user, ind) => {
                            <button key={ind}>{user.Userid}</button>
                        })
                    }
                    jhj
                </div>
            </div>

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;