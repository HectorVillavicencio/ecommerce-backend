import { Router } from 'express';
import { OrderController }      from '../controllers/OrderController';
import { OrderService }         from '../services/OrderService';
import { OrderRepository }      from '../repositories/OrderRepository';
import { AuthMiddleware }       from '../middlewares/AuthMiddleware';
import { RoleMiddleware }       from '../middlewares/RoleMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { CreateOrderDto } from '../dtos/order.dto';

const router = Router();

const ctrl      = new OrderController(new OrderService(new OrderRepository()));
const auth      = new AuthMiddleware().middleware();
const adminOnly = new RoleMiddleware(['admin']).middleware();
const validateCreate = new ValidationMiddleware(CreateOrderDto).middleware();

// Usuario autenticado
router.post('/',              auth, validateCreate, ctrl.create);
router.get('/my',             auth, ctrl.myOrders);
router.get('/:id',            auth, ctrl.findOne);
router.patch('/:id/cancel',   auth, ctrl.cancelOwn);
router.get('/:id/pdf',        auth, ctrl.downloadPdf);

// Admin
router.get('/admin/all',             auth, adminOnly, ctrl.adminFindAll);
router.patch('/admin/:id/confirm',   auth, adminOnly, ctrl.adminConfirm);
router.patch('/admin/:id/cancel',    auth, adminOnly, ctrl.adminCancel);

export default router;