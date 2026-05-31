import { Router } from 'express';
import authRoutes     from './auth.routes';
import productRoutes  from './product.routes';
import categoryRoutes from './category.routes';
import userRoutes     from './user.routes';
import orderRoutes    from './order.routes';

export const router = Router();

router.use('/auth',       authRoutes);
router.use('/products',   productRoutes);
router.use('/categories', categoryRoutes);
router.use('/users',      userRoutes);
router.use('/orders',     orderRoutes);