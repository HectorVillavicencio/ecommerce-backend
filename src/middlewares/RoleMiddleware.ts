import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from './BaseMiddleware';

type Role = 'admin' | 'customer';

export class RoleMiddleware extends BaseMiddleware {
  constructor(private readonly roles: Role[]) {
    super();
  }

  handle(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }
    if (!this.roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Sin permiso para esta acción' });
      return;
    }
    next();
  }
}
