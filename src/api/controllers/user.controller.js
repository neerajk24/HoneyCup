import express from 'express';
import * as userService from '../../services/user.service.js';

const router = express.Router();
// PUT /api/users/profile - Update the current user's profile
router.put('/profile', async (req, res) => {
    try {
        // Assuming you have some middleware to extract user ID from the token
        const userId = req.user.id;
        const updatedProfile = await userService.updateUserProfile(userId, req.body);
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.put('/profile', async (req, res) => {
    try {
        // Assuming you have some middleware to extract user ID from the token
        const userId = req.user.id;
        const updatedProfile = await userService.updateUserProfile(userId, req.body);
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// POST /api/users - Create a new user
router.post('/', async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/users/login - Authenticate a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await userService.authenticateUser(email, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// GET /api/users/profile - Get the current user's profile
router.get('/profile', async (req, res) => {
  try {
    // Assuming you have some middleware to extract user ID from the token
    const userId = req.user.id;
    const userProfile = await userService.getUserProfile(userId);
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
