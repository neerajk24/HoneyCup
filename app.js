/**
 * This is the main file for the server application.
 * It sets up the server, connects to the database, and defines routes and middleware.
 */
// app.js

import express from 'express';
import connectDatabase from './src/config/database.js';
import authRoutes from './src/api/routes/auth.route.js';
import userRoutes from './src/api/routes/user.route.js';
import mediaRoutes from './src/api/routes/media.route.js';
import chatRoutes from './src/api/routes/chat.route.js';
import blockRoutes from './src/api/routes/blocked.route.js';
import friendRoutes from './src/api/routes/friends.route.js';
import socketRoutes from './src/api/routes/socket.Chat.route.js';
import passport from 'passport';
import './src/config/passport-setup.js';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { createServer } from 'http';  // Changed import
import { Server } from 'socket.io';  // Changed import
import { ChatSocket } from './src/Sockets/chat.socket.js';

const URL = 'http://localhost:5173';
const createApp = () => {
    const app = express();

    // Connect to MongoDB
    connectDatabase();

    // Middleware setup
    app.use(express.json());
    app.use(cors());
    app.use(passport.initialize());

    // Define routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/media', mediaRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/blocked', blockRoutes);
    app.use('/api/friends', friendRoutes);
    app.use('/app/socketChat', socketRoutes);

    // Swagger setup
    const swaggerOptions = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'HoneyCup API',
                version: '1.0.0',
                description: 'Documentation for the HoneyCup API',
            },
        },
        apis: ['./src/api/routes/*.js'],
    };

    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    return app;
};

const app = createApp();

const PORT = process.env.PORT || 3000;
const server = createServer(app);  // Changed line
const io = new Server(server, {
    cors: {
        origin: URL, // Replace with your React app URL
        methods: ['GET', 'POST'], // Add any other HTTP methods you need
        allowedHeaders: ['Content-Type'], // Add any other headers you need
        credentials: true, // Allow sending credentials (cookies, authorization headers, etc.)
    },
});
ChatSocket(io);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;