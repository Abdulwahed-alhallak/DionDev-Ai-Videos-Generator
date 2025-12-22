import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

// واجهة بيانات المستخدم في JWT - JWT payload interface
export interface JwtPayload {
  user_id: number;
  username: string;
  role: string;
}

// تمديد واجهة Request لتشمل بيانات المستخدم - Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware للتحقق من صحة التوكن - JWT authentication middleware
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'غير مصرح - الرجاء تسجيل الدخول',
      message: 'No token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'التوكن غير صالح',
      message: 'Invalid or expired token' 
    });
  }
};

/**
 * Middleware للتحقق من الصلاحيات - Role-based authorization
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'غير مصرح',
        message: 'User not authenticated' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'ليس لديك صلاحية للوصول',
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

/**
 * Middleware للتحقق من أن المستخدم نشط - Check if user is active
 */
export const checkActiveUser = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: استعلام قاعدة البيانات للتحقق من حالة المستخدم
  // For now, just continue
  next();
};
