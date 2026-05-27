import { Request, Response, NextFunction } from 'express';

export abstract class BaseMiddleware {
  abstract handle(req: Request, res: Response, next: NextFunction): void;

  // Convierte la clase en función middleware de Express
  middleware() {
    return (req: Request, res: Response, next: NextFunction) =>
      this.handle(req, res, next);
  }
}
