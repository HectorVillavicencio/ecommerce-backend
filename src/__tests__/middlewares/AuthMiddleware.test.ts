import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthMiddleware } from '../../middlewares/AuthMiddleware';

jest.mock('jsonwebtoken');
const mockVerify = jwt.verify as jest.Mock;

const mockReq = (authHeader?: string) =>
  ({ headers: { authorization: authHeader } }) as Request;

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

const next: NextFunction = jest.fn();

describe('AuthMiddleware', () => {
  let mw: AuthMiddleware;

  beforeEach(() => {
    mw = new AuthMiddleware();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('llama a next() si el token es válido', () => {
    const payload = { userId: 1, role: 'admin' };
    mockVerify.mockReturnValue(payload);

    const req = mockReq('Bearer valid-token');
    const res = mockRes();
    mw.handle(req, res, next);

    expect(next).toHaveBeenCalled();
    expect((req as any).user).toEqual(payload);
  });

  it('responde 401 si no hay header', () => {
    const req = mockReq();
    const res = mockRes();
    mw.handle(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token requerido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('responde 401 si el token es inválido', () => {
    mockVerify.mockImplementation(() => { throw new Error('invalid'); });

    const req = mockReq('Bearer bad-token');
    const res = mockRes();
    mw.handle(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido o expirado' });
  });
});
