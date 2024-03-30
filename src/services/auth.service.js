// src/services/auth.service.js
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Password is incorrect');
  }
  return user; // You might want to generate and return a JWT token instead
};
