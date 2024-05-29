// src/api/routes/auth.route.js
import express from 'express';
import passport from 'passport';
import { createAuthController } from '../controllers/auth.controller.js'; // Import the function to create the auth controller
import * as AuthService from '../../services/auth.service.js'; // Import all named exports from auth.service.js

const router = express.Router();

const authController = createAuthController(AuthService); // Create the auth controller

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Unauthorized
 */
router.post('/login', authController.loginUser);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Authenticate with Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google authentication callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Unauthorized
 */
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.handleGoogleAuthResponse);

/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     summary: Authenticate with Facebook
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Facebook for authentication
 */
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

/**
 * @swagger
 * /auth/facebook/callback:
 *   get:
 *     summary: Facebook authentication callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Unauthorized
 */
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), authController.handleFacebookAuthResponse);

/**
 * @swagger
 * /auth/apple:
 *   get:
 *     summary: Authenticate with Apple
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Apple for authentication
 */
router.get('/apple', passport.authenticate('apple'));

/**
 * @swagger
 * /auth/apple/callback:
 *   get:
 *     summary: Apple authentication callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Unauthorized
 */
router.get('/apple/callback', passport.authenticate('apple'), authController.appleAuth);

export default router;
