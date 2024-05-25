import User from '../../models/user.model.js';

// Controller function to block a user
export const blockUser = async (req, res) => {
    const { userId, blockedUserId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.blockUser(blockedUserId);
        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to unblock a user
export const unblockUser = async (req, res) => {
    const { userId, blockedUserId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.unblockUser(blockedUserId);
        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to get the list of blocked users
export const getBlockedUsers = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate('blockedUsers', 'username email');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ blockedUsers: user.blockedUsers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
