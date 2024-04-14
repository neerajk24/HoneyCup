import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json'; // Adjust the path as necessary

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
