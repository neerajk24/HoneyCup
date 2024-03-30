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
