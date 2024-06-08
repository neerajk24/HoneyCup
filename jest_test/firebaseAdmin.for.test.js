// src/config/firebaseAdmin.config.jest.js

import admin from "firebase-admin";
import path from "path";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";

// Resolve the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let adminInitialized = false;
const serviceAccountPath = path.resolve(
  __dirname,
  "../src/config/serviceAccountKey.json"
);

if (existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.MONGODB_URI,
  });

  adminInitialized = true;
  console.log(
    "-> Firebase Admin SDK has been initialized. We got the serviceAccountKey.json data"
  );
} else {
  console.warn(
    "Firebase Admin SDK not initialized. Service account key file not found."
  );
}

export default admin;
export { adminInitialized };
