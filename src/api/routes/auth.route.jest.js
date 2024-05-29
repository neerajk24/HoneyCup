// src/api/routes/auth.route.jest.js

import express from 'express';
import passport from 'passport';
import { createAuthController } from '../controllers/auth.controller.js';
import * as AuthService from '../../services/auth.service.js';

const router = express.Router();

const authController = createAuthController(AuthService);

router.post('/login', authController.loginUser);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.handleGoogleAuthResponse);
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), authController.handleFacebookAuthResponse);
router.get('/apple', passport.authenticate('apple'));
router.get('/apple/callback', passport.authenticate('apple'), authController.appleAuth);

export default router;
