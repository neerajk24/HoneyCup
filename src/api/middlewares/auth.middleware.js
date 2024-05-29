// src/api/middlewares/auth.middleware.js
import admin from '../../config/firebaseAdmin.config.js';

export const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(403).send('Unauthorized');
    }

    const token = req.headers.authorization.split('Bearer ')[1]; // Received idToken from AuthController
    const decodedToken = await admin.auth().verifyIdToken(token); // Step: verifyIdToken(idToken) is called with FirebaseAuth
    console.log('Token Verified!', decodedToken); // Step: decodedToken is received from Firebase
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).send('Unauthorized');
  }
};
