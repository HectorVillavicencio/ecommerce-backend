export interface JwtPayload {
  userId: number;
  role:   'admin' | 'customer';
}

// Extiende Express.Request para que req.user esté tipado globalmente
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
