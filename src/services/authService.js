// src/services/authService.js

import { sign } from 'jsonwebtoken';
import { findOne } from '../models/user';

export async function login(email, password) {
    const user = await findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new Error('Incorrect email or password');
    }

    const token = sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Remove the password from the output
    user.password = undefined;

    return { user, token };
}
