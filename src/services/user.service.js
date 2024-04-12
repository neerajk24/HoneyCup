// src/services/user.service.js
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
}

// Example function to create a user, incorporating the hashPassword function
export async function createUser(userData) {
  const hashedPassword = await hashPassword(userData.password);
  const user = new User({ ...userData, password: hashedPassword });
  await user.save();
  return user;
}

// Function to authenticate a user 
export async function authenticateUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Authentication failed. User not found.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Authentication failed. Invalid password.');
  }

  return user;
}


// Function to update user profile
export async function updateUserProfile(userId, profileData) {
  if (!profileData.age || !profileData.sex) {
    throw new Error('Completing the profile requires age and sex.');
  }
  
  // Assuming you have logic to fetch and update the user based on userId
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Update user with profileData
  Object.assign(user, profileData);
  await user.save();

  return user;
}
