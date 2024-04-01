// src/api/routes/auth.routes.js
import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user and returns a token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: Authentication successful.
 *       400:
 *         description: Invalid credentials provided.
 */
router.post('/login', authController.loginUser);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Google authentication
 *     description: Redirects to Google's OAuth 2.0 authentication.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirected to Google for authentication.
 */
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the callback from Google OAuth 2.0 authentication.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google authentication successful.
 *       401:
 *         description: Google authentication failed.
 */
router.get('/auth/google/callback', passport.authenticate('google'), authController.googleAuth);

/**
 * @swagger
 * /api/auth/apple:
 *   get:
 *     summary: Apple authentication
 *     description: Redirects to Apple's OAuth 2.0 authentication.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirected to Apple for authentication.
 */
router.get('/auth/apple', passport.authenticate('apple'));

/**
 * @swagger
 * /api/auth/apple/callback:
 *   get:
 *     summary: Apple OAuth callback
 *     description: Handles the callback from Apple OAuth 2.0 authentication.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Apple authentication successful.
 *       401:
 *         description: Apple authentication failed.
 */
router.get('/auth/apple/callback', passport.authenticate('apple'), authController.appleAuth);

export default router;
