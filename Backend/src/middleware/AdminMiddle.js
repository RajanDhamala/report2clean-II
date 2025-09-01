
import asyncHandler from '../utils/AsyncHandler.js';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export const adminAuth = asyncHandler((req, res, next) => {
  const token = req.cookies?.adminToken;
console.log("token:",token)
  if (!token) {
    // No token → redirect to login
    return res.redirect('/admin/login');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // now contains { id, username }
    next();
  } catch (err) {
    // Invalid/expired token → redirect to login
    return res.redirect('/admin/login');
  }
});


