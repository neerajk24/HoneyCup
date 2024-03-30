// src/api/routes/auth.routes.js
import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', authController.loginUser);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/auth/google/callback', passport.authenticate('google'), authController.googleAuth);
router.get('/auth/apple', passport.authenticate('apple'));
router.get('/auth/apple/callback', passport.authenticate('apple'), authController.appleAuth);

export default router;
