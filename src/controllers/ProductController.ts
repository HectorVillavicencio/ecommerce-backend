import { Request, Response, NextFunction } from 'express';
import { BaseController }  from './BaseController';
import { ProductService }  from '../services/ProductService';
import { ProductQueryDto } from '../dtos/product.dto';

export class ProductController extends BaseController {
  constructor(private readonly service: ProductService) { super(); }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parsear y validar query params con valores default
      const query = ProductQueryDto.parse(req.query);
      this.ok(res, await this.service.findAll(query));
    } catch (e) { next(e); }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.ok(res, await this.service.findById(Number(req.params.id)));
    } catch (e) { next(e); }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.ok(res, await this.service.create(req.body), 201);
    } catch (e) { next(e); }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.ok(res, await this.service.update(Number(req.params.id), req.body));
    } catch (e) { next(e); }
  };

  // PATCH /products/:id/toggle — ocultar/mostrar producto
  toggleActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { active } = req.body;
      if (typeof active !== 'boolean') {
        res.status(400).json({ error: 'El campo active debe ser true o false' });
        return;
      }
      this.ok(res, await this.service.toggleActive(Number(req.params.id), active));
    } catch (e) { next(e); }
  };

  // PATCH /products/:id/variants/:variantId/toggle — ocultar/mostrar variante
  toggleVariantActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isActive } = req.body;
      if (typeof isActive !== 'boolean') {
        res.status(400).json({ error: 'El campo isActive debe ser true o false' });
        return;
      }
      this.ok(res, await this.service.toggleVariantActive(
        Number(req.params.id),
        Number(req.params.variantId),
        isActive,
      ));
    } catch (e) { next(e); }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (e) { next(e); }
  };
}