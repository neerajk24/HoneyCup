// src/api/controllers/authController.js

const authService = require('../../services/authService');

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user,
            },
        });
    } catch (error) {
        res.status(401).json({
            status: 'fail',
            message: error.message,
        });
    }
};
