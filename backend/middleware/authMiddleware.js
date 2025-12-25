const admin = require('../config/firebase');

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // This adds the user's Firebase info to the request
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { protect };