import { Request, Response, NextFunction } from 'express';

export const requireRole = (role: 'admin' | 'student') => (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
  next();
};
