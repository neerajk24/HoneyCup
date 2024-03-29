// app.js or server.js
require('dotenv').config();
import express, { json } from 'express';
import connectDatabase from './src/config/database';
import authRoutes from './src/api/routes/authRoutes';
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
