/**
 * This is the main file for the server application.
 * It sets up the server, connects to the database, and defines routes and middleware.
 */
// app.js or server.js

import dotenv from 'dotenv';

dotenv.config();

import express, { json } from 'express';
import connectDatabase from './src/config/database.js'; // Update the import statement to include the file extension
import authRoutes from './src/api/routes/auth.route.js'; // Update the import statement to include the file extension
import userRoutes from './src/api/routes/user.route.js'; // Update the import statement to include the file extension

import cors from 'cors'; // Import the cors package
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

// Connect to MongoDB
connectDatabase();
 

// Middleware setup
app.use(json());
app.use(cors()); 
app.use('/api', authRoutes);
app.use('/api', userRoutes);

// ... other middleware

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
    // Note: Adjust the path to where your route definitions are located
    apis: ['./routes/*.js'],
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Routes setup
app.use('/api', authRoutes);
// ... other routes


// ... rest of the server setup
// At the bottom of app.js or server.js
export default app;
