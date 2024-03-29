// src/services/authService.js

const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.login = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new Error('Incorrect email or password');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Remove the password from the output
    user.password = undefined;

    return { user, token };
};
