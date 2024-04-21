// src/api/controllers/auth.controller.js
import express from 'express';
import { google_Auth } from '../../services/auth.service.js';
import * as authService from '../../services/auth.service.js';
import jwt from 'jsonwebtoken';
import passport from 'passport'; // Import passport if needed
import { verifyToken } from '../middlewares/auth.middleware.js'; // Import verifyToken middleware

const authRouter = express.Router();

// Apply verifyToken middleware to routes that require authentication
authRouter.use(verifyToken);

// Function to handle user login with email and password
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await authService.authenticateUser(email, password);
    // Generate token after successful authentication
    const token = generateAuthToken(user); 
    res.send({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Placeholder for handling Google auth response
export async function handleGoogleAuthResponse(req, res) {
  try {
    const user = await google_Auth();
    if (user) {
      const token = generateAuthToken(user);
      res.status(200).send({ token }); // Include token in the response
    } else {
      res.status(401).send({ message: 'Invalid Google authentication' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
}

// Placeholder for handling Facebook auth response
export function handleFacebookAuthResponse(req, res) {
  try {
    passport.authenticate('facebook', (err, user, info) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: 'Internal server error' });
      }

      if (!user) {
        return res.status(401).send({ message: 'Facebook authentication failed' });
      }

      const token = generateAuthToken(user);
      res.status(200).send({ token }); // Include token in the response
    })(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
}

// Placeholder for token generation logic
function generateAuthToken(user) {             
  const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '6h' });
  return jwtToken;
}

// Placeholder for handling Apple auth response
export async function handleAppleAuthResponse(req, res) {
  // Similar to Google auth, handle response after Apple authentication
}

// Export router instead of individual functions
export default authRouter;


//export { loginUser, handleGoogleAuthResponse, handleAppleAuthResponse , handleFacebookAuthResponse };

export const googleAuth = async (req, res) => {
  // Google auth logic might largely be handled by Passport's middleware,
  // so this might just handle redirect or response after successful authentication
};

export const appleAuth = async (req, res) => {
  // Similar to Google auth, handle response after Apple authentication
};
