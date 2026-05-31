import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { BaseMiddleware } from './BaseMiddleware';

type ValidateTarget = 'body' | 'query';

export class ValidationMiddleware extends BaseMiddleware {
  private schema: ZodSchema;
  private target: ValidateTarget;

  constructor(schema: ZodSchema, target: ValidateTarget = 'body') {
    super();
    this.schema = schema;
    this.target = target;
  }

  handle(req: Request, res: Response, next: NextFunction): void {
    if (!this.schema) {
      res.status(500).json({ error: 'Schema no definido en ValidationMiddleware' });
      return;
    }

    const data   = this.target === 'query' ? req.query : req.body;
    const result = this.schema.safeParse(data);

    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    if (this.target === 'query') {
      req.query = result.data as any;
    } else {
      req.body = result.data;
    }
    next();
  }
}