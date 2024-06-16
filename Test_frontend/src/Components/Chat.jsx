import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { BlobServiceClient } from "@azure/storage-blob";

const URL = "http://localhost:3000";

const Chat = (props) => {
    const [receiverId, setReceiverId] = useState("");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [conversationId, setConversationId] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        console.log(props.user);
        const socket = io(URL, {
            auth: {
                userid: props.user,
            }
        });
        socketRef.current = socket;
        socket.on('recieveMessage', (newMessage) => {
            setMessages((prev) => {
                return [...prev, newMessage]
            })
        });
        socket.on('previousMessages', (previousMessages) => {
            console.log(`Previous messages are here.. at ${props.user} side`);
            setMessages(previousMessages);
        });
        socket.on('unreadMessages', (unreadMessages) => {
            console.log("UnreadMessageCameWOOO");
            props.setUnreadmsg(unreadMessages);
        })

        socket.on('onlineUsers', (onlineUsers) => {
            setOnlineUsers(onlineUsers);
        });

        return () => {
            socket.disconnect();
            socket.off('recieveMessage');
            socket.off('previousMessages');
            socket.off('unreadMessages');
        };
    }, [props.user]);

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
    async function markMessageRead(user, convoId) {
        try {
            const response = await axios.post('http://localhost:3000/api/socketChat/chats/markMsgRead', {
                senderId: user,
                conversationId: convoId
            });
            props.setUnreadmsg(prevUnreadMsg => prevUnreadMsg.filter(msg => msg.sender !== user));
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

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
            //Mark the messages as read.
            markMessageRead(user, response.data.conversationId);
        } catch (error) {
            console.error("Error joining room:", error);
        }
    }
    const fileInputRef = useRef(null);

    const uploadToBlob = async (file) => {
        const URL = import.meta.env.VITE_API_URL;
        const blobServiceClient = new BlobServiceClient(URL);
        const containerClient = blobServiceClient.getContainerClient("azure-filearchive");
        const blobName = `${Date.now()}-${file.name}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        try {
            await blockBlobClient.uploadData(file, {
                blockSize: 4 * 1024 * 1024,
                concurrency: 20,
                onProgress: (ev) => console.log(`Uploaded ${ev.loadedBytes} bytes`)
            });

            return blockBlobClient.url;
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileUrl = await uploadToBlob(file);
            if (fileUrl) {
                console.log(fileUrl);
                sendFileMessage(fileUrl, file.type);
            }
        }
    };

    const sendFileMessage = (fileUrl, fileType) => {
        const newMessage = {
            sender_id: props.user,
            receiver_id: receiverId,
            content: fileUrl,
            content_type: fileType.startsWith('image/') ? 'image' : 'file',
            content_link: fileUrl,
            timestamp: new Date(),
            is_read: false,
            is_appropriate: true,
        };
        socketRef.current.emit('sendMessages', { conversationId, message: newMessage });
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column">
            <h1>Receiver: {receiverId}</h1>
            <div className="row flex-grow-1">
                <div className="col-8 border border-danger d-flex flex-column">
                    <div className="message-container overflow-auto" style={{ height: '600px' }}>
                        {messages.map((msg, index) => (
                            <div key={index} className="p-2">
                                <span className="font-weight-bold">{msg.sender_id}: </span>
                                {msg.content_type === 'text' ? (
                                    <span>{msg.content}</span>
                                ) : (
                                    <a href={msg.content} target="_blank" rel="noopener noreferrer">
                                        {msg.content_type === 'image' ? 'Image' : 'File'}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="d-flex flex-column mt-5 col-4 border border-primary overflow-auto">
                    {props.participants
                        .filter(user => user !== props.user)
                        .map((user, ind) => {
                            const unreadMsgCount = props.unreadMsg.find(msg => msg.sender === user)?.count || 0;
                            const isOnline = onlineUsers.includes(user);
                            return (
                                <button
                                    key={ind}
                                    className={`btn m-4 btn-block text-left ${isOnline ? 'btn-success' : 'btn-danger'}`}
                                    onClick={() => joinRoomProcess(user)}
                                >
                                    {user} {unreadMsgCount > 0 && <span className="badge bg-danger ms-2">{unreadMsgCount}</span>}
                                </button>
                            );
                        })}
                </div>
            </div>
            <div className="row mt-auto">
                <div className="col-12 d-flex p-2">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control me-2"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                        <button
                            className="btn btn-secondary"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <FontAwesomeIcon icon={faPaperclip} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;