import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.register(req.body);
      res.status(201).json({ data: user });
    } catch (e) { next(e); }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.login(req.body);
      res.json({ data: result });
    } catch (e) { next(e); }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const result = await this.service.refresh(refreshToken);
      res.json({ data: result });
    } catch (e) { next(e); }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.logout(req.user!.userId);
      res.status(204).send();
    } catch (e) { next(e); }
  };
}
