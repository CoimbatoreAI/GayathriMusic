import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'e2d3a419a2102590838d0a9ae031114a70255b45be2f02a7923e6f8e27e37aac9b65673a553cf2e43e4abee6bc12b7e36f10990629eecbf9b21c2b13af2ae10b';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: 'admin' | 'student' | 'super_admin';
  };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        res.status(403).json({ error: 'Invalid token' });
        return;
      }

      req.user = user as { id: string; username: string; role: 'admin' | 'student' };
      next();
    });
  } else {
    res.status(401).json({ error: 'No authorization header' });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

export const generateToken = (userId: number, username: string, role: 'admin' | 'student'): string => {
  return jwt.sign(
    { id: userId, username, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};
