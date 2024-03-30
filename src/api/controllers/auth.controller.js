// src/api/controllers/auth.controller.js
import * as authService from '../../services/auth.service.js';

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.authenticateUser(email, password);
    // Generate token, handle session, etc.
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const googleAuth = async (req, res) => {
  // Google auth logic might largely be handled by Passport's middleware,
  // so this might just handle redirect or response after successful authentication
};

export const appleAuth = async (req, res) => {
  // Similar to Google auth, handle response after Apple authentication
};
