import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { BaseMiddleware } from './BaseMiddleware';

export class ValidationMiddleware extends BaseMiddleware {
  constructor(private readonly schema: ZodSchema) {
    super();
  }

  handle(req: Request, res: Response, next: NextFunction): void {
    const result = this.schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    req.body = result.data; // body limpio, tipado y sin campos desconocidos
    next();
  }
}
