// src/api/controllers/auth.controller.jest_test.js

import request from 'supertest';
import express from 'express';
import { createAuthController } from '../src/api/controllers/auth.controller.js';
import * as authService from '../src/services/auth.service.jest.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

// Mock middleware to set req.user
const mockUserMiddleware = (req, res, next) => {
  req.user = { id: 1 };
  next();
};

// Apply the mock middleware before the auth controller routes
app.use('/api/auth/google/callback', mockUserMiddleware);
app.use('/api/auth/facebook/callback', mockUserMiddleware);
app.use('/api/auth', createAuthController(authService));

describe('Auth Controller', () => {
  it('should log in a user and return a token', async () => {
    jest.spyOn(authService, 'authenticateUser').mockResolvedValue({ id: 1, email: 'test@example.com' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should handle login with invalid credentials', async () => {
    jest.spyOn(authService, 'authenticateUser').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('should handle Google auth response', async () => {
    const mockUser = { id: 1 };
    const token = jwt.sign({ userId: mockUser.id }, process.env.JWT_SECRET, { expiresIn: '6h' });

    const res = await request(app).get('/api/auth/google/callback');
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.token).toBe(token);
  });

  it('should handle Facebook auth response', async () => {
    const mockUser = { id: 1 };
    const token = jwt.sign({ userId: mockUser.id }, process.env.JWT_SECRET, { expiresIn: '6h' });

    const res = await request(app).get('/api/auth/facebook/callback');
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.token).toBe(token);
  });
});
