import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const URL = "http://localhost:3000";

const Chat = (props) => {
    const [receiverId, setReceiverId] = useState("");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [conversationId, setConversationId] = useState("");
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io(URL, {
            auth: {
                userid: props.user,
            }
        });
        socketRef.current = socket;
        socket.on('recieveMessage', (newMessage) => {
            setMessages((prev)=>{
                return [...prev , newMessage]
            })
        });
        socket.on('previousMessages', (previousMessages) => {
            console.log(`Previous messages are here.. at ${props.user} side`);
            setMessages(previousMessages);
        });
        return () => {
            socket.off('recieveMessage');
            socket.off('previousMessages');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() !== '') {
            const newMessage = {
                sender_id: props.user,
                receiver_id: receiverId,
                content: message,
                content_type: 'text', 
                content_link: null, 
                timestamp: new Date(),
                is_read: false, 
                is_appropriate: true,
            };
            socketRef.current.emit('sendMessages', { conversationId, message: newMessage });
            setMessage('');
        }
    };


    const joinRoomProcess = async (user) => {
        setReceiverId(user);
        try {
            console.log(`Sending request for users ${user} and ${props.user}`);
            const response = await axios.post('http://localhost:3000/api/socketChat/chats/getconvoId', {
                userId1: props.user,
                userId2: user
            });
            //Setting the conversation id
            setConversationId(response.data.conversationId);
            // calling the socket to joinRoom..
            socketRef.current.emit('joinRoom', { userId: props.user, conversationId: response.data.conversationId });
        } catch (error) {
            console.error("Error joining room:", error);
        }
    }

    return (
        <div className="container-fluid vh-100 d-flex flex-column">
            <h1>Reciever : {receiverId}</h1>
            <div className="row flex-grow-1">
                <div className="col-8 border border-danger d-flex flex-column overflow-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className="p-2">
                            <span className="font-weight-bold">{msg.sender_id}: </span>
                            <span>{msg.content}</span>
                        </div>
                    ))}
                </div>
                <div className=" d-flex flex-column mt-5 col-4 border border-primary overflow-auto">
                    {props.participants
                        .filter(user => user !== props.user)
                        .map((user, ind) => (
                            <button
                                key={ind}
                                className="btn btn-primary m-4 btn-block text-left"
                                onClick={() => joinRoomProcess(user)}
                            >
                                {user}
                            </button>
                        ))}
                </div>
            </div>
            <div className="row mt-auto">
                <div className="col-12 d-flex p-2">
                    <input
                        type="text"
                        className="form-control me-2"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;