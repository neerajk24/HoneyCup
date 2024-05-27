// src/api/controllers/auth.controller.js

import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

export function createAuthController(authService) {
  const router = express.Router();

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await authService.authenticateUser(email, password);
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '6h' });
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/google/callback', (req, res) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, { expiresIn: '6h' });
      res.status(200).send({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  });

  router.get('/facebook/callback', (req, res) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, { expiresIn: '6h' });
      res.status(200).send({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  });

  router.get('/apple/callback', (req, res) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, { expiresIn: '6h' });
      res.status(200).send({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  });

  return router;
}
