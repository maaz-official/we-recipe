// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect middleware to secure routes
export const protect = async (req, res, next) => {
  let token;

  // Check if token is provided in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract token

      // Decode token and get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Pass control to the next middleware
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

// Admin middleware for role-based access
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // Pass control to the next middleware
  } else {
    res.status(403).json({ error: 'Not authorized as an admin' });
  }
};
