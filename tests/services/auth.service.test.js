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

  after(async function() {
    await User.deleteMany({});
    await mongoose.disconnect();
  });
    /**
     * Test case for the authenticateUser function.
     */
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
});
