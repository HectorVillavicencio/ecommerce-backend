import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BaseMiddleware } from './BaseMiddleware';
import { env } from '../config/env';
import { JwtPayload } from '../interfaces/JwtPayload';

export class AuthMiddleware extends BaseMiddleware {
  handle(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token requerido' });
      return;
    }

    try {
      const token   = header.split(' ')[1];
      const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
      req.user = payload; // disponible en las capas siguientes
      next();
    } catch {
      res.status(401).json({ error: 'Token inválido o expirado' });
    }
  }
}
