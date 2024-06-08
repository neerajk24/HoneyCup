// src/services/auth.service.js

import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
//import firebaseApp from "../config/firebaseAdmin.config.js"; // auth.service

async function loadFirebaseApp() {
  if (
    process.env.NODE_ENV === "test" ||
    process.argv.some((arg) => arg.includes("jest"))
  ) {
    firebaseApp = (await import("../../jest_test/firebaseAdmin.for.test.js"))
      .default;
  } else {
    firebaseApp = (await import("../config/firebaseAdmin.config.js")).default;
  }
}

async function initializeFirebase() {
  await loadFirebaseApp();
  auth = getAuth(firebaseApp);
}

function getAuthInstance() {
  if (!auth) {
    throw new Error(
      "Firebase not initialized. Call initializeFirebase() first."
    );
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
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Password is incorrect");
  }
  return user;
};
