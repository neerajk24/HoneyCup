// src/api/controllers/user.controller.js
import * as userService from '../../services/user.service.js';

/**
 * Updates the user profile.
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object from the request.
 * @param {string} req.user.id - The ID of the user.
 * @param {Object} req.body - The updated profile data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the profile is updated.
 */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedProfile = await userService.updateUserProfile(userId, req.body);
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Creates a new user.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The user data for creation.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user is created.
 */
export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Authenticates a user and generates a token.
 * @param {Object} req - The request object.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user is authenticated and the token is generated.
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await userService.authenticateUser(email, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

/**
 * Retrieves the user profile.
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object from the request.
 * @param {string} req.user.id - The ID of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user profile is retrieved.
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await userService.getUserProfile(userId);
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.log(req.user.id);
  }
};
