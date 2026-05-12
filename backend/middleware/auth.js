'use strict';

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * requireAuth — verifies JWT from Authorization header.
 * Sets req.user on success.
 */
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select('-password');

    if (!user || !user.active) {
      return res.status(401).json({ success: false, error: 'User not found or deactivated' });
    }

    req.user = user;
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ success: false, error: msg });
  }
}

/**
 * requireAdmin — must run after requireAuth.
 * Blocks non-admin users.
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
