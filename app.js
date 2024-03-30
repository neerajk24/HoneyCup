/**
 * This is the main file for the server application.
 * It sets up the server, connects to the database, and defines routes and middleware.
 */
// app.js or server.js

import dotenv from 'dotenv';

dotenv.config();

import express, { json } from 'express';
import connectDatabase from './src/config/database.js'; // Update the import statement to include the file extension
import authRoutes from './src/api/routes/auth.routes.js'; // Update the import statement to include the file extension
import cors from 'cors'; // Import the cors package
const app = express();

// Connect to MongoDB
connectDatabase();
 

// Middleware setup
app.use(json());
app.use(cors()); // Use the cors middleware
// ... other middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Routes setup
app.use('/api', authRoutes);
// ... other routes

// ... rest of the server setup
// At the bottom of app.js or server.js
export default app;
