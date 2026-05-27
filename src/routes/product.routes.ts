import { Router } from 'express';
import { ProductController }    from '../controllers/ProductController';
import { ProductService }       from '../services/ProductService';
import { ProductRepository }    from '../repositories/ProductRepository';
import { AuthMiddleware }       from '../middlewares/AuthMiddleware';
import { RoleMiddleware }       from '../middlewares/RoleMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

const router = Router();

// Inyección de dependencias
const ctrl = new ProductController(
  new ProductService(new ProductRepository())
);

const auth           = new AuthMiddleware().middleware();
const adminOnly      = new RoleMiddleware(['admin']).middleware();
const validateCreate = new ValidationMiddleware(CreateProductDto).middleware();
const validateUpdate = new ValidationMiddleware(UpdateProductDto).middleware();

router.get('/',       ctrl.findAll);                               // público
router.get('/:id',    ctrl.findById);                              // público
router.post('/',      auth, adminOnly, validateCreate, ctrl.create);
router.put('/:id',    auth, adminOnly, validateUpdate, ctrl.update);
router.delete('/:id', auth, adminOnly, ctrl.delete);

export default router;
