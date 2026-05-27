import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';

export const errorHandler = (
  err:   Error,
  _req:  Request,
  res:   Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error('Error inesperado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
};
