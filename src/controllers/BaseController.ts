import { Response } from 'express';
import { IController } from '../interfaces/IController';
import { Request, NextFunction } from 'express';

export abstract class BaseController implements IController {
  abstract findAll(req: Request, res: Response, next: NextFunction): Promise<void>;
  abstract findById(req: Request, res: Response, next: NextFunction): Promise<void>;
  abstract create(req: Request, res: Response, next: NextFunction): Promise<void>;
  abstract update(req: Request, res: Response, next: NextFunction): Promise<void>;
  abstract delete(req: Request, res: Response, next: NextFunction): Promise<void>;

  protected ok(res: Response, data: unknown, status = 200): void {
    res.status(status).json({ data });
  }
}
