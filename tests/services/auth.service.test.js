import { expect } from 'chai';
import * as authService from '../../src/services/auth.service.js';
import bcrypt from 'bcryptjs';
import User from '../../src/models/user.model.js';
import connectDatabase from '../../src/config/database.js';
import mongoose from 'mongoose';

/**
 * Test suite for the AuthService module.
 */
describe('AuthService', () => {
  before(async function() {
    // Ensure the database is connected before tests run
    await connectDatabase();
  });

  beforeEach(async function() {
    // Clear the User collection before each test
    await User.deleteMany({});
  });

  after(async function() {
    await mongoose.disconnect();
  });

  // 1. Testing: should authenticate a user with correct credentials
  describe('authenticateUser', () => {
    it('should authenticate a user with correct credentials', async () => {
      // Create a user to test with
      const newUser = await User.create({
        username: 'testUser',
        email: 'user@example.com',
        password: 'password'
      });

      // Now attempt to authenticate
      const result = await authService.authenticateUser('user@example.com', 'password');
      expect(result).to.exist;
      expect(result.username).to.equal('testUser');
    });
  });

  // 2. Testing: should throw an error for invalid password
  describe('AuthService - Invalid Password', () => {
    it('should throw an error for invalid password', async () => {
      // Create a user with hashed password
      const newUser = await User.create({
        username: 'testUser2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('password', 8)
      });

      // Attempt to authenticate with incorrect password
      try {
        await authService.authenticateUser('user2@example.com', 'wrongpassword');
        // If no error thrown, fail the test
        expect.fail('Expected authenticateUser to throw an error for invalid password');
      } catch (error) {
        // Assertion
        expect(error.message).to.equal('Password is incorrect');
      }
    });
  });

  // 3. Testing: should throw an error for user not found
  describe('AuthService - User Not Found', () => {
    it('should throw an error for user not found', async () => {
      // Attempt to authenticate a non-existent user
      try {
        await authService.authenticateUser('nonexistentuser@example.com', 'password');
        // If no error thrown, fail the test
        expect.fail('Expected authenticateUser to throw an error for user not found');
      } catch (error) {
        // Assertion
        expect(error.message).to.equal('User not found');
      }
    });
  });
});
