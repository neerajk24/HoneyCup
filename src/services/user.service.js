// src/services/user.service.js

import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { getCurrentLocation } from '../utils/geolocation.js';

// Utility function to hash passwords
export async function hashPassword(password) {
    return bcrypt.hash(password, 12);
}

// Utility function to compare passwords
export async function comparePassword(candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
}

// Create a new user with location and hashed password
export async function createUser(userData) {
    const hashedPassword = await hashPassword(userData.password);
    const coordinates = await getCurrentLocation();
    const user = new User({
        ...userData,
        password: hashedPassword,
        location: {
            type: 'Point',
            coordinates
        }
    });
    await user.save();
    return user;
}

// Authenticate user with email and password
export async function authenticateUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Authentication failed. User not found.');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error('Authentication failed. Invalid password.');
    }

    return user;
}

// Get user profile by ID
export async function getUserProfile(userId) {
    return await User.findById(userId).exec();
}

// Update user profile by ID
export async function updateUserProfile(userId, profileData) {
    if (!profileData.age || !profileData.sex) {
        throw new Error('Completing the profile requires age and sex.');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    Object.assign(user, profileData);
    await user.save();

    return user;
}

// Find users within a 5 km radius and update proximity_users
export async function findNearbyUsers(currentUserId, coordinates) {
    const nearbyUsers = await User.find({
        _id: { $ne: currentUserId },
        location: {
            $geoWithin: {
                $centerSphere: [coordinates, 5 / 6378.1]
            }
        }
    });

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
        throw new Error('Current user not found');
    }

    currentUser.proximity_users = nearbyUsers.map(user => user._id);
    await currentUser.save();

    return nearbyUsers;
}
