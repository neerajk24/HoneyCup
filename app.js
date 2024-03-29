// app.js or server.js

const express = require('express');
const authRoutes = require('./src/api/routes/authRoutes');
// ... other imports

const app = express();

// Middleware setup
app.use(express.json());
// ... other middleware

// Routes setup
app.use('/api', authRoutes);
// ... other routes

// ... rest of the server setup
