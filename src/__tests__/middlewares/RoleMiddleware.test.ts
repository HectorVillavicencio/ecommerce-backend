import { Request, Response, NextFunction } from 'express';
import { RoleMiddleware } from '../../middlewares/RoleMiddleware';

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};
const next: NextFunction = jest.fn();

describe('RoleMiddleware', () => {
  it('llama a next() si el usuario tiene el rol requerido', () => {
    const req = { user: { userId: 1, role: 'admin' } } as any;
    new RoleMiddleware(['admin']).handle(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it('responde 403 si el rol no coincide', () => {
    const req = { user: { userId: 2, role: 'customer' } } as any;
    const res = mockRes();
    new RoleMiddleware(['admin']).handle(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('responde 401 si no hay usuario en req', () => {
    const req = {} as any;
    const res = mockRes();
    new RoleMiddleware(['admin']).handle(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
