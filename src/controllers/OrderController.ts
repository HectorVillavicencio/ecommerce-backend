import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/OrderService';
import { OrderRepository } from '../repositories/OrderRepository';
import path from 'path';

export class OrderController {
  constructor(private readonly service: OrderService) {}

  // Usuario: crear orden
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.service.create(req.user!.userId, req.body);
      res.status(201).json({ data: order });
    } catch (e) { next(e); }
  };

  // Usuario: ver sus órdenes
  myOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.service.findByUser(req.user!.userId);
      res.json({ data: orders });
    } catch (e) { next(e); }
  };

  // Usuario: ver una orden propia
  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.service.findById(Number(req.params.id));
      if (order.userId !== req.user!.userId && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Sin permiso' }); return;
      }
      res.json({ data: order });
    } catch (e) { next(e); }
  };

  // Usuario: cancelar su orden
  cancelOwn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.service.cancelByUser(
        Number(req.params.id),
        req.user!.userId,
      );
      res.json({ data: order });
    } catch (e) { next(e); }
  };

  // Descargar PDF
  downloadPdf = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.service.findById(Number(req.params.id));
      if (!order.pdfUrl) {
        res.status(404).json({ error: 'PDF no disponible' }); return;
      }
      const filepath = path.join(process.cwd(), order.pdfUrl);
      res.download(filepath);
    } catch (e) { next(e); }
  };

  // Admin: ver todas las órdenes
  adminFindAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = '1', limit = '20', status } = req.query as any;
      const result = await this.service.findAll({
        page:   Number(page),
        limit:  Number(limit),
        status,
      });
      res.json(result);
    } catch (e) { next(e); }
  };

  // Admin: confirmar orden y descontar stock
  adminConfirm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.service.confirmByAdmin(Number(req.params.id));
      res.json({ data: order });
    } catch (e) { next(e); }
  };

  // Admin: cancelar orden
  adminCancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.service.cancelByAdmin(Number(req.params.id));
      res.json({ data: order });
    } catch (e) { next(e); }
  };
}