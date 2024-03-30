import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../../app.js'; // Adjust the path as necessary
import { expect } from 'chai';
import User from '../../../src/models/user.model.js'; // Adjust the path as necessary
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

describe('AuthController', () => {


  // Create a user before each test
  beforeEach(async () => {
    await User.create({
      email: 'user@example.com',
      password: 'password', // Ensure this password aligns with how your user schema hashes passwords
      username: 'testUser', // Add other required fields as per your User model
    });
  });

  // Cleanup after each test
  afterEach(async () => {
    await User.deleteMany({});
  });

  // Disconnect after all tests have run
  after(async function() {
    await mongoose.disconnect();
  });

  describe('POST /login', () => {
    it('should return 200 and a user object for valid credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'user@example.com',
          password: 'password',
        });

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property('email', 'user@example.com');
      // Add more assertions based on the properties you expect in the response
    });

    it('should return 400 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'invalid@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property('error');
      // You can add assertions about the content of the error message if it's consistent
    });
  });

  // Tests for googleAuth and appleAuth would similarly mock the respective strategies
});


