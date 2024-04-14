// src/api/controllers/auth.controller.js
import express from 'express';
import { google_Auth } from '../../services/auth.service.js';
import * as authService from '../../services/auth.service.js';
import jwt from 'jsonwebtoken';

// Function to handle user login with email and password
async function loginUser(req, res) {
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
async function handleGoogleAuthResponse(req, res) {
  try {
    const user = await google_Auth();
    if (user) {
      const token = generateAuthToken(user); 
      res.send({ token });
    } else {
      res.status(401).send({ message: 'Invalid Google authentication' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
}

// Placeholder for handling Facebook auth response
async function handleFacebookAuthResponse(req, res) {
  try {
    // Passport handles authentication and provides the user data
    passport.authenticate('facebook', (err, user, info) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: 'Internal server error' });
      }

      if (!user) {
        return res.status(401).send({ message: 'Facebook authentication failed' });
      }

      // Generate JWT token with user information
      const token = generateAuthToken(user);

      // Respond with the token
      res.send({ token });
    })(req, res); // Pass req and res to passport middleware
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
}

// Placeholder for token generation logic
function generateAuthToken(user) {             // use .env here
  const jwtToken = jwt.sign({ userId: user.id }, 'jwt_secret', { expiresIn: '1h' });
  return jwtToken;
}

// Placeholder for handling Apple auth response
async function handleAppleAuthResponse(req, res) {
  // Similar to Google auth, handle response after Apple authentication
}

export { loginUser, handleGoogleAuthResponse, handleAppleAuthResponse , handleFacebookAuthResponse };

export const googleAuth = async (req, res) => {
  // Google auth logic might largely be handled by Passport's middleware,
  // so this might just handle redirect or response after successful authentication
};

export const appleAuth = async (req, res) => {
  // Similar to Google auth, handle response after Apple authentication
};
