import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/tokenUtils';

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ 
        error: 'No authentication token found',
        requiresRefresh: true
      });
    }

    try {
      const decoded = verifyAccessToken(token);
      req.admin = decoded;
      next();
    } catch (tokenError: any) {
      // If token is expired, signal client to refresh
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expired', 
          requiresRefresh: true 
        });
      }
      
      // For other token errors
      throw tokenError;
    }
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      error: `Authentication failed: ${error.message}`,
      requiresRefresh: false
    });
  }
};
