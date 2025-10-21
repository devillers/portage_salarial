import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import User from '../models/User';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('Please define the JWT_SECRET environment variable');
  }

  return secret;
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
    getJwtSecret(),
    { algorithm: 'HS256' }
  );
}

/**
 * Verify JWT token and return user data
 */
export async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
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
const getAuthorizationHeader = (req = {}) => {
  const headers = req.headers;

  if (!headers) {
    return null;
  }

  if (typeof headers.get === 'function') {
    return headers.get('authorization') || headers.get('Authorization');
  }

  return headers.authorization || headers.Authorization || null;
};

const respondWith = (res, status, payload) => {
  if (res && typeof res.status === 'function') {
    return res.status(status).json(payload);
  }

  return NextResponse.json(payload, { status });
};

export function requireAuth(handler) {
  return async (req, res) => {
    try {
      const authHeader = getAuthorizationHeader(req);
      const token = typeof authHeader === 'string'
        ? authHeader.replace(/^Bearer\s+/i, '').trim()
        : null;

      if (!token) {
        return respondWith(res, 401, {
          success: false,
          message: 'Access token is required'
        });
      }

      const user = await verifyToken(token);

      if (res && typeof res === 'object') {
        req.user = user;
        return handler(req, res);
      }

      const augmentedRequest = new Proxy(req, {
        get(target, prop, receiver) {
          if (prop === 'user') {
            return user;
          }

          const value = Reflect.get(target, prop, receiver);
          if (typeof value === 'function') {
            return value.bind(target);
          }

          return value;
        }
      });

      return handler(augmentedRequest, res);
    } catch (error) {
      return respondWith(res, 401, {
        success: false,
        message: error.message || 'Invalid or expired token'
      });
    }
  };
}

/**
 * Extract token from request headers
 */
export function extractToken(req) {
  const authHeader = getAuthorizationHeader(req);

  if (typeof authHeader === 'string') {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (match && match[1]) {
      return match[1].trim();
    }
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
        return respondWith(res, 403, {
          success: false,
          message: 'Insufficient permissions'
        });
      }

      return handler(req, res);
    });
  };
}