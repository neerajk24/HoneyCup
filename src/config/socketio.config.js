// src/config/socketio.config.js


import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import createApp from '../../app.js';
import { authenticateSocket, authorizeSocketActions } from '../api/middlewares/chat.middleware.js'; // Import middleware
import { sendMessage } from '../services/chat.service.js'; // Import chat services

const JWT_SECRET = process.env.JWT_SECRET;

// Create HTTP server
const app = createApp();
const server = http.createServer(app);

// Initialize Socket.io with the server
const io = socketIo(server, {
    // Add secure configuration options here (e.g., CORS, origins, etc.)
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Socket.io Middleware
io.use((socket, next) => {
    authenticateSocket(socket, (error) => {
        if (error) {
            return next(new Error('Socket authentication failed'));
        }
        authorizeSocketActions(socket, (error) => {
            if (error) {
                return next(new Error('Unauthorized'));
            }
            next();
        });
    });
});

// Socket.io Event Handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle events like 'message', 'disconnect', etc.
    socket.on('message', async (data) => {
        console.log('Message received:', data);
        try {
            // Extract message data
            const { senderId, recipientId, content, messageType } = data;

            // Send the message using chat service
            const message = await sendMessage(senderId, recipientId, content, messageType);

            // Broadcast the message to all connected clients
            io.emit('message', message);
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    });

    // Handle user typing indicator event
    socket.on('typing', (data) => {
        // Broadcast typing indicator to all connected clients
        socket.broadcast.emit('typing', data);
    });

    // Handle message delivery receipt event
    socket.on('message_delivered', (data) => {
        // Broadcast delivery receipt to all connected clients
        io.emit('message_delivered', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Export Socket.io instance
export default io;
