// src/api/middlewares/chat.middleware.js

import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to authenticate socket connection.
 * @param {object} socket - The socket object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 * @throws {Error} If authentication fails.
 */
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

/**
 * Middleware to authorize socket actions.
 * @param {object} socket - The socket object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 * @throws {Error} If authorization fails.
 */
const authorizeSocketActions = (socket, next) => {
    try {
        // Implement authorization logic based on user role, chat membership, etc.
        // For example, check if the user has permission to send messages in a specific chat room
        // You can access the user object attached to the socket (socket.user) for user details
        // If authorized, call next(), otherwise, call next(new Error('Unauthorized'));
        if (socket.user.role === 'admin') {
            // Example: Allow admin users to perform any action
            next();
        } else {
            // Example: Allow regular users to send messages only
            // Modify this logic based on your application's requirements
            next();
        }
    } catch (error) {
        next(error);
    }
};

export { authenticateSocket, authorizeSocketActions };
