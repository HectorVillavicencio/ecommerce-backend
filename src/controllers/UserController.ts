import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { UserService }    from '../services/UserService';

export class UserController extends BaseController {
  constructor(private readonly service: UserService) { super(); }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page = '1', limit = '20' } = req.query as any;
      this.ok(res, await this.service.findAll({
        search,
        page:  Number(page),
        limit: Number(limit),
      }));
    } catch (e) { next(e); }
  };

  // Ver mi propio perfil
findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Si es la ruta /me usa el id del token, si es /admin/:id usa el param
    const id = req.params.id ? Number(req.params.id) : req.user!.userId;
    this.ok(res, await this.service.findById(id));
  } catch (e) { next(e); }
};

  // Admin actualiza cualquier usuario
  adminUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.ok(res, await this.service.adminUpdate(Number(req.params.id), req.body));
    } catch (e) { next(e); }
  };

  // Usuario actualiza su propio perfil
  selfUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.ok(res, await this.service.selfUpdate(req.user!.userId, req.body));
    } catch (e) { next(e); }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (e) { next(e); }
  };

  // Métodos requeridos por BaseController (no usados acá)
  create = async (_req: Request, res: Response, next: NextFunction) => {
    res.status(405).json({ error: 'Usar /auth/register' });
  };
  update = this.adminUpdate;

  // Ver mi propio perfil (/me)
  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
    this.ok(res, await this.service.findById(req.user!.userId));
    } catch (e) { next(e); }
  };
}