import express from 'express';
import { blockUser, unblockUser, getBlockedUsers } from '../controllers/blocked.controller.js';

const router = express.Router();

// Routes for blocking and unblocking users
router.post('/block', blockUser);
router.post('/unblock', unblockUser);
router.get('/:userId/blocked', getBlockedUsers);

export default router;
