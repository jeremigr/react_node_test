// server/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// General Authentication Middleware
const protect = (req, res, next) => {
  // Récupère le header Authorization
  const authHeader = req.get('Authorization') || '';

  // Attend "Bearer <token>"
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const token = match[1]; // extrait uniquement le JWT

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, name, ... }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin Authorization Middleware
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { protect, adminOnly };
