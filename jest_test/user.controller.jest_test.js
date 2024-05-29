// jest_test/user.controller.jest_test.js

import request from 'supertest';
import express from 'express';
import * as userController from '../src/api/controllers/user.controller.js';
import * as userService from '../src/services/user.service.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

jest.mock('../src/services/user.service.js');

const mockUserMiddleware = (req, res, next) => {
  req.user = { id: 'testUserId' }; // Mock user ID for testing
  next();
};

app.post('/api/users', userController.createUser);
app.post('/api/users/login', userController.loginUser);
app.get('/api/users/profile', mockUserMiddleware, userController.getUserProfile);
app.put('/api/users/profile', mockUserMiddleware, userController.updateUserProfile);
app.post('/api/users/nearby', mockUserMiddleware, userController.findNearbyUsers);

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user and return 201 status', async () => {
      const mockUser = { id: 'newUserId', username: 'testuser', email: 'test@example.com' };
      userService.createUser.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/users')
        .send({ username: 'testuser', password: 'testpassword', email: 'test@example.com', location: { type: 'Point', coordinates: [1, 1] } });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockUser);
    });

    it('should handle errors and return 400 status', async () => {
      userService.createUser.mockRejectedValue(new Error('Test error'));

      const res = await request(app)
        .post('/api/users')
        .send({ username: 'testuser', password: 'testpassword', email: 'test@example.com', location: { type: 'Point', coordinates: [1, 1] } });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Test error');
    });
  });

  describe('loginUser', () => {
    it('should log in a user and return a token', async () => {
      const token = 'mockToken';
      userService.authenticateUser.mockResolvedValue(token);

      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'testpassword' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ token });
    });

    it('should handle errors and return 401 status', async () => {
      userService.authenticateUser.mockRejectedValue(new Error('Invalid credentials'));

      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('getUserProfile', () => {
    it('should get user profile and return 200 status', async () => {
      const mockUserProfile = { id: 'testUserId', username: 'testuser', email: 'test@example.com' };
      userService.getUserProfile.mockResolvedValue(mockUserProfile);

      const res = await request(app)
        .get('/api/users/profile');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUserProfile);
    });

    it('should handle errors and return 404 status', async () => {
      userService.getUserProfile.mockRejectedValue(new Error('User not found'));

      const res = await request(app)
        .get('/api/users/profile');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile and return 200 status', async () => {
      const mockUpdatedProfile = { id: 'testUserId', username: 'updateduser', email: 'updated@example.com' };
      userService.updateUserProfile.mockResolvedValue(mockUpdatedProfile);

      const res = await request(app)
        .put('/api/users/profile')
        .send({ username: 'updateduser', email: 'updated@example.com' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUpdatedProfile);
    });

    it('should handle errors and return 400 status', async () => {
      userService.updateUserProfile.mockRejectedValue(new Error('Update failed'));

      const res = await request(app)
        .put('/api/users/profile')
        .send({ username: 'updateduser', email: 'updated@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Update failed');
    });
  });

  describe('findNearbyUsers', () => {
    it('should find nearby users and return 200 status', async () => {
      const mockNearbyUsers = [{ id: 'nearbyUserId', username: 'nearbyuser', email: 'nearby@example.com' }];
      userService.findNearbyUsers.mockResolvedValue(mockNearbyUsers);

      const res = await request(app)
        .post('/api/users/nearby')
        .send({ coordinates: [1, 1] });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockNearbyUsers);
    });

    it('should handle errors and return 500 status', async () => {
      userService.findNearbyUsers.mockRejectedValue(new Error('Search failed'));

      const res = await request(app)
        .post('/api/users/nearby')
        .send({ coordinates: [1, 1] });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Search failed');
    });
  });
});
