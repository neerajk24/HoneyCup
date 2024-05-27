// src/config/firebaseAdmin.config.js
import admin from 'firebase-admin';
import path from 'path';
import { readFileSync, existsSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

let adminInitialized = false;
const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');

if (existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "mongodb://127.0.0.1:27017/honeyCup" 
  });

  adminInitialized = true;
  console.log('-> Firebase Admin SDK has been initialized. We got the serviceAccountKey.json data')
} else {
  console.warn('Firebase Admin SDK not initialized. Service account key file not found.');
}

export default admin;
export { adminInitialized };
