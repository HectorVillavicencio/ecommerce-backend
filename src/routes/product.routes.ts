import { Router } from 'express';
import { ProductController }    from '../controllers/ProductController';
import { ProductService }       from '../services/ProductService';
import { ProductRepository }    from '../repositories/ProductRepository';
import { AuthMiddleware }       from '../middlewares/AuthMiddleware';
import { RoleMiddleware }       from '../middlewares/RoleMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

const router = Router();

const ctrl = new ProductController(
  new ProductService(new ProductRepository())
);

const auth           = new AuthMiddleware().middleware();
const adminOnly      = new RoleMiddleware(['admin']).middleware();
const validateCreate = new ValidationMiddleware(CreateProductDto).middleware();
const validateUpdate = new ValidationMiddleware(UpdateProductDto).middleware();

// ── Públicas ──────────────────────────────────────────
router.get('/',      ctrl.findAll);    // ?search=ryzen&categoryId=3&sort=price_asc&page=1&limit=20
router.get('/:id',   ctrl.findById);

// ── Admin ─────────────────────────────────────────────
router.post('/',         auth, adminOnly, validateCreate, ctrl.create);
router.put('/:id',       auth, adminOnly, validateUpdate, ctrl.update);
router.delete('/:id',    auth, adminOnly, ctrl.delete);

// ── Toggle visibilidad ────────────────────────────────
router.patch('/:id/toggle',                              auth, adminOnly, ctrl.toggleActive);
router.patch('/:id/variants/:variantId/toggle',          auth, adminOnly, ctrl.toggleVariantActive);

export default router;