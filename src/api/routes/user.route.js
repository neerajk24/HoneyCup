// src/api/routes/user.route.js
import express from 'express';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.put('/profile', userController.updateUserProfile);
router.post('/', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/profile', userController.getUserProfile);

export default router;
