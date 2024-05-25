// src/api/controllers/friends.controller.js
import User from '../../models/user.model.js';

// Function to add a user to friends
export const addFriend = async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.addFriend(friendId);
        res.status(200).json({ message: 'Friend added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to remove a user from friends
export const removeFriend = async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.removeFriend(friendId);
        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to get the list of friends
export const getFriends = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate('friends', 'username email');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ friends: user.friends });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
