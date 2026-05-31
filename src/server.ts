import 'dotenv/config';
import app       from './config/app';
import { env }   from './config/env';
import { prisma } from './config/prisma';
import { router } from './routes';
import { errorHandler } from './errors/errorHandler';
import express from 'express';
import path    from 'path';

// Registrar rutas
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/v1', router);
app.use(errorHandler);

const start = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Base de datos conectada');

    app.listen(env.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${env.port}`);
      console.log(`📋 Endpoints disponibles:`);
      console.log(`   POST /api/v1/auth/register`);
      console.log(`   POST /api/v1/auth/login`);
      console.log(`   POST /api/v1/auth/refresh`);
      console.log(`   POST /api/v1/auth/logout`);
      console.log(`   GET  /api/v1/products`);
      console.log(`   GET  /api/v1/categories`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar:', err);
    process.exit(1);
  }
};

start();
