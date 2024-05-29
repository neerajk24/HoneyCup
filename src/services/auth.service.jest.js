// src/services/auth.service.jest.js
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import firebaseApp from '../config/firebaseAdmin.config.jest.js'; // Import the app instance

// Module-level variable to store initialized Firebase instance
let auth;

// Function to get the Firebase authentication instance
function getAuthInstance() {
  if (!auth) {
    auth = getAuth(firebaseApp);
  }
  return auth;
}

// Function to handle Google authentication
export async function google_Auth() {
  try {
    const auth = getAuthInstance(); // Firebase authentication instance
    const provider = new GoogleAuthProvider(); // new Google provider instance
    const result = await signInWithPopup(auth, provider); // Use `signInWithPopup` to trigger the Google Sign-In flow

    // Handle successful authentication
    if (result) {
      const user = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };
      return user;
    } else {
      console.error("Google authentication cancelled.");
      return null;
    }
  } catch (error) {
    console.error("Error during Google authentication:", error);
    throw error;
  }
}

// Function to handle Facebook authentication
export async function facebook_Auth() {
  try {
    const auth = getAuthInstance(); // Firebase authentication instance
    const provider = new FacebookAuthProvider(); // new Facebook provider instance
    const result = await signInWithPopup(auth, provider); // Use `signInWithPopup` to trigger the Facebook Sign-In flow

    // Handle successful authentication
    if (result) {
      const user = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };
      return user;
    } else {
      console.error("Facebook authentication cancelled.");
      return null;
    }
  } catch (error) {
    console.error("Error during Facebook authentication:", error);
    throw error;
  }
}

// Function to authenticate user with email and password
export const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Password is incorrect');
  }
  return user;
};
