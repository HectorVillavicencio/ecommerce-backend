import { Router } from 'express';
import { UserController }       from '../controllers/UserController';
import { UserService }          from '../services/UserService';
import { UserRepository }       from '../repositories/UserRepository';
import { AuthMiddleware }       from '../middlewares/AuthMiddleware';
import { RoleMiddleware }       from '../middlewares/RoleMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { SelfUpdateUserDto, AdminUpdateUserDto } from '../dtos/user.dto';

const router = Router();

const ctrl      = new UserController(new UserService(new UserRepository()));
const auth      = new AuthMiddleware().middleware();
const adminOnly = new RoleMiddleware(['admin']).middleware();
const validateSelf  = new ValidationMiddleware(SelfUpdateUserDto).middleware();
const validateAdmin = new ValidationMiddleware(AdminUpdateUserDto).middleware();

// Usuario autenticado — actualiza su propio perfil
router.get('/me', auth, ctrl.me);
router.put('/me',     auth, validateSelf, ctrl.selfUpdate);

// Admin — gestión de usuarios
router.get('/',       auth, adminOnly, ctrl.findAll);
router.get('/:id',    auth, adminOnly, ctrl.findById);
router.put('/:id',    auth, adminOnly, validateAdmin, ctrl.adminUpdate);
router.delete('/:id', auth, adminOnly, ctrl.delete);

export default router;