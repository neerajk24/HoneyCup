// src/api/routes/user.route.js
import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { getUserProfile, updateUserProfile, createUser, loginUser, findNearbyUsers } from '../controllers/user.controller.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * tags:
 *   - name: User
 *     description: User management
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *       404:
 *         description: User not found.
 */
router.get('/profile', verifyToken, getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update the current user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
router.put('/profile', verifyToken, updateUserProfile);

/**
 * @swagger
 * /api/users:
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
router.post('/', createUser);

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
router.post('/login', loginUser);

/**
 * @swagger
 * /api/users/nearby:
 *   get:
 *     summary: Find nearby users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nearby users retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get('/nearby', verifyToken, findNearbyUsers);

export default router;
