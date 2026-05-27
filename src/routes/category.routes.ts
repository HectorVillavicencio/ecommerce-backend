import { Router } from 'express';
import { CategoryController }   from '../controllers/CategoryController';
import { CategoryService }      from '../services/CategoryService';
import { CategoryRepository }   from '../repositories/CategoryRepository';
import { AuthMiddleware }       from '../middlewares/AuthMiddleware';
import { RoleMiddleware }       from '../middlewares/RoleMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';

const router = Router();

const ctrl = new CategoryController(
  new CategoryService(new CategoryRepository())
);

const auth           = new AuthMiddleware().middleware();
const adminOnly      = new RoleMiddleware(['admin']).middleware();
const validateCreate = new ValidationMiddleware(CreateCategoryDto).middleware();
const validateUpdate = new ValidationMiddleware(UpdateCategoryDto).middleware();

router.get('/',       ctrl.findAll);
router.get('/:id',    ctrl.findById);
router.post('/',      auth, adminOnly, validateCreate, ctrl.create);
router.put('/:id',    auth, adminOnly, validateUpdate, ctrl.update);
router.delete('/:id', auth, adminOnly, ctrl.delete);

export default router;
