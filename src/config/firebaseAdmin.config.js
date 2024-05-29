// src/config/firebaseAdmin.config.js

import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

let adminInitialized = false;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');

if (existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  // Check if the default app is already initialized
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "mongodb://127.0.0.1:27017/honeyCup"
    });

    adminInitialized = true;
    console.log('-> Firebase Admin SDK has been initialized. We got the serviceAccountKey.json data');
  } else {
    adminInitialized = true; // Firebase is already initialized
    console.log('-> Firebase Admin SDK was already initialized.');
  }
} else {
  console.warn('Firebase Admin SDK not initialized. Service account key file not found.');
}

export default admin;
export { adminInitialized };
