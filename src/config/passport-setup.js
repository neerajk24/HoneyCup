// src/config/passport-setup.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { Strategy as AppleStrategy } from 'passport-apple';
import User from '../models/user.model.js';

passport.use(new GoogleStrategy({
  clientID: "1042379704022-ol4fq8tds3o6vfc0tfnshvcj3tdg3hbt.apps.googleusercontent.com", // Update with your Google client ID
  clientSecret: "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",
  callbackURL: "http://localhost:3000/api/auth/google/callback",
  scope: ['profile']
}, async (accessToken, refreshToken, profile, done) => {
  const newUser = {
    googleId: profile.id,
    email: profile.emails[0].value,
    displayName: profile.displayName,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    // ... other profile data you want to store
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

// Add Facebook authentication strategy
passport.use(new FacebookStrategy({
  clientID: "796375262361625",
  clientSecret: "03c3430c54a6088705faf2aeffa06059",
  callbackURL: "http://localhost:3000/api/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
  const newUser = {
    facebookId: profile.id,
    email: profile.emails[0].value,
    displayName: `${profile.name.givenName} ${profile.name.familyName}`,
    // ... other profile data you want to store
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

// passport.use(new AppleStrategy({
//   // configuration...
// }, async (accessToken, refreshToken, idToken, profile, done) => {
//   // find or create user in your database
// }));
