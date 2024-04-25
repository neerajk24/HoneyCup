// src/api/middlewares/chat.middleware.js

// Import necessary modules and models
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Middleware to authenticate socket connection
const authenticateSocket = async (socket, next) => {
    try {
        // Extract token from socket handshake
        const token = socket.handshake.auth.token;
        if (!token) {
            throw new Error('Authentication token not provided');
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            throw new Error('Invalid authentication token');
        }

        // Find user by ID from token
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Attach user to socket for future reference
        socket.user = user;
        next();
    } catch (error) {
        next(new Error('Socket authentication failed'));
    }
};

// Middleware to authorize socket actions
const authorizeSocketActions = (socket, next) => {
    // Implement authorization logic based on user role, chat membership, etc.
    // For example, check if the user has permission to send messages in a specific chat room
    // You can access the user object attached to the socket (socket.user) for user details
    // If authorized, call next(), otherwise, call next(new Error('Unauthorized'));
    if (socket.user.role === 'admin') {
        // Example: Allow admin users to perform any action
        next();
    } else {
        // Example: Allow regular users to send messages only
        if (socket.action === 'send_message') {
            next();
        } else {
            next(new Error('Unauthorized'));
        }
    }
};

export { authenticateSocket, authorizeSocketActions };
