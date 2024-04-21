// tests/integration/controllers/auth.controller.test.js

import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../../app.js'; // Adjust the path as necessary
import { expect } from 'chai';
import sinon from 'sinon'; // Import sinon for mocking
import jwt from 'jsonwebtoken'; // Import jwt for token verification
import * as authService from '../../../src/services/auth.service.js'; // Import auth service functions
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
      expect(res.body).to.have.property('token');
      // Verify token
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded.userId).to.exist;
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

  describe('GET /auth/google', () => {
    it('should return 200 and a token for successful Google authentication', async () => {
      // Mock google_Auth function to return a user object
      sinon.stub(authService, 'google_Auth').resolves({ id: 'googleUserId', email: 'google@example.com' });
  
      const res = await request(app).get('/auth/google');
  
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property('token');
      // Verify token
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded.userId).to.exist;
      // Add more assertions as needed
    });
  
    // Add more test cases for different scenarios, such as unsuccessful authentication
  });
  
  describe('GET /auth/facebook', () => {
    it('should return 200 and a token for successful Facebook authentication', async () => {
      // Mock passport.authenticate function
      sinon.stub(authService, 'handleFacebookAuthResponse').callsFake((req, res) => {
        const user = { id: 'facebookUserId', email: 'facebook@example.com' };
        const token = authService.generateAuthToken(user);
        res.send({ token });
      });
  
      const res = await request(app).get('/auth/facebook');
  
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property('token');
      // Verify token
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded.userId).to.exist;
      // Add more assertions as needed
    });
  
    // Add more test cases for different scenarios, such as unsuccessful authentication
  });

  describe('POST /apple-auth', () => {
    it('should return 302 and a token for successful Apple authentication', async () => {
      // Mock appleAuth function to return a user object
      sinon.stub(authService, 'appleAuth').resolves({ id: 'appleUserId', email: 'apple@example.com' });

      const res = await request(app).post('/api/apple-auth');

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property('token');
      // Verify token
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded.userId).to.exist;
      // Add more assertions as needed
    });

    // Add more test cases for different scenarios, such as unsuccessful authentication
  });
});
