// src/config/passport-setup.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/user.model.js';

// Google strategy configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/auth/google/callback",
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  const newUser = {
    googleId: profile.id,
    email: profile.emails[0].value,
    displayName: profile.displayName,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
  };

  try {
    let existingUser = await User.findOne({ googleId: newUser.googleId });
    if (existingUser) {
      return done(null, existingUser); // User already exists
    }

    const savedUser = await new User(newUser).save();
    return done(null, savedUser); // New user created
  } catch (error) {
    console.error("Error creating user from Google auth:", error);
    return done(error);
  }
}));

// Facebook strategy configuration
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
  const newUser = {
    facebookId: profile.id,
    email: profile.emails[0].value,
    displayName: `${profile.name.givenName} ${profile.name.familyName}`,
  };

  try {
    let existingUser = await User.findOne({ facebookId: newUser.facebookId });
    if (existingUser) {
      return done(null, existingUser); // User already exists
    }

    const savedUser = await new User(newUser).save();
    return done(null, savedUser); // New user created
  } catch (error) {
    console.error("Error creating user from Facebook auth:", error);
    return done(error);
  }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
