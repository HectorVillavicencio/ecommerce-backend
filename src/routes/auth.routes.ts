import { Router } from 'express';
import { AuthController }       from '../controllers/AuthController';
import { AuthService }          from '../services/AuthService';
import { UserRepository }       from '../repositories/UserRepository';
import { AuthMiddleware }       from '../middlewares/AuthMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { LoginDto, RegisterDto, RefreshTokenDto } from '../dtos/auth.dto';

const router = Router();

// Inyección de dependencias: Repository → Service → Controller
const ctrl = new AuthController(
  new AuthService(new UserRepository())
);

const validateRegister = new ValidationMiddleware(RegisterDto).middleware();
const validateLogin    = new ValidationMiddleware(LoginDto).middleware();
const validateRefresh  = new ValidationMiddleware(RefreshTokenDto).middleware();
const auth             = new AuthMiddleware().middleware();

router.post('/register', validateRegister, ctrl.register);
router.post('/login',    validateLogin,    ctrl.login);
router.post('/refresh',  validateRefresh,  ctrl.refresh);
router.post('/logout',   auth,             ctrl.logout);

export default router;
