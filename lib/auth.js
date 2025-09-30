import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

/**
 * Generate JWT token for user authentication
 */
export function generateToken(userId) {
  return jwt.sign(
    { 
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    },
    JWT_SECRET,
    { algorithm: 'HS256' }
  );
}

/**
 * Verify JWT token and return user data
 */
export async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }
    
    return user;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Middleware to protect API routes
 */
export function requireAuth(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'Access token is required' 
        });
      }
      
      const user = await verifyToken(token);
      req.user = user;
      
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: error.message 
      });
    }
  };
}

/**
 * Extract token from request headers
 */
export function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

/**
 * Check if user has required role
 */
export function requireRole(roles = []) {
  return (handler) => {
    return requireAuth(async (req, res) => {
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: 'Insufficient permissions' 
        });
      }
      
      return handler(req, res);
    });
  };
}