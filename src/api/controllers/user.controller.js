// src/api/controllers/user.controller.js
import * as userService from '../../services/user.service.js';

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updatedProfile = await userService.updateUserProfile(userId, req.body);
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await userService.authenticateUser(email, password);
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const userProfile = await userService.getUserProfile(userId);
        res.status(200).json(userProfile);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
