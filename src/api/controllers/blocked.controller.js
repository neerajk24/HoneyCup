// src/api/controllers/blocked.controller.js

import User from '../../models/user.model.js';

// Controller to add a user to the blocked list
export const addBlockedUser = async (req, res) => {
    const { userId, blockedUserId } = req.body;

    try {
        const user = await User.findById(userId);
        const blockedUser = await User.findById(blockedUserId);

        if (!user || !blockedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.addBlockedUser(blockedUserId);
        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to remove a user from the blocked list
export const removeBlockedUser = async (req, res) => {
    const { userId, blockedUserId } = req.body;

    try {
        const user = await User.findById(userId);
        const blockedUser = await User.findById(blockedUserId);

        if (!user || !blockedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.removeBlockedUser(blockedUserId);
        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to get the list of blocked users
export const getBlockedUsers = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const blockedUsers = await user.getBlockedUsers();
        res.status(200).json({ blockedUsers });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
