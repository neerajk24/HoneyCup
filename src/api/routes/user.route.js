import express from 'express';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update the current user's profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's new email.
 *               name:
 *                 type: string
 *                 description: The user's new name.
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *       400:
 *         description: Error updating user profile.
 */
router.put('/profile', userController.updateUserProfile);

/**
 * @swagger
 * /api/users/:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Error creating user.
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful.
 *       401:
 *         description: Authentication failed.
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *       404:
 *         description: User not found.
 */
router.get('/profile', userController.getUserProfile);

export default router;
