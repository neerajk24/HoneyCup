// src/config/passport-setup.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as AppleStrategy } from 'passport-apple';
import User from '../models/user.model.js';

passport.use(new GoogleStrategy({
  // configuration...
}, async (accessToken, refreshToken, profile, done) => {
  // find or create user in your database
}));

passport.use(new AppleStrategy({
  // configuration...
}, async (accessToken, refreshToken, idToken, profile, done) => {
  // find or create user in your database
}));
