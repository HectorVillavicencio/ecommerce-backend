import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { CategoryService } from '../services/CategoryService';

export class CategoryController extends BaseController {
  constructor(private readonly service: CategoryService) { super(); }

  findAll = async (_req: Request, res: Response, next: NextFunction) => {
    try { this.ok(res, await this.service.findAll()); }
    catch (e) { next(e); }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try { this.ok(res, await this.service.findById(Number(req.params.id))); }
    catch (e) { next(e); }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try { this.ok(res, await this.service.create(req.body), 201); }
    catch (e) { next(e); }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try { this.ok(res, await this.service.update(Number(req.params.id), req.body)); }
    catch (e) { next(e); }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (e) { next(e); }
  };
}
