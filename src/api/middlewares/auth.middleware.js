// /src/api/middlewares/auth.middleware.js
import admin from '../../config/firebaseAdmin.config.js';

export const verifyToken = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(403).send('Unauthorized');
  }

  const token = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token Verified!', decodedToken);
    // Attach decodedToken to request for further use
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).send('Unauthorized');
  }
};
