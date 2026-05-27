import jwt  from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository';
import { AppError }       from '../errors/AppError';
import { env }            from '../config/env';
import { LoginInput, RegisterInput, UserResponseDto } from '../dtos/auth.dto';
import { JwtPayload }     from '../interfaces/JwtPayload';

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async register(dto: RegisterInput) {
    const exists = await this.userRepo.findByEmail(dto.email);
    if (exists) throw new AppError('El email ya está registrado', 409);

    const user = await this.userRepo.create(dto);
    return UserResponseDto.parse(user);
  }

  async login(dto: LoginInput) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new AppError('Credenciales inválidas', 401);

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new AppError('Credenciales inválidas', 401);

    const payload: JwtPayload = { userId: user.id, role: user.role as 'admin' | 'customer' };

    const accessToken  = jwt.sign(payload, env.jwtSecret,        { expiresIn: env.jwtExpiresIn as any });
    const refreshToken = jwt.sign(payload, env.jwtRefreshSecret,  { expiresIn: env.jwtRefreshExpiresIn as any });

    await this.userRepo.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: UserResponseDto.parse(user),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as JwtPayload;
      const user    = await this.userRepo.findById(payload.userId);

      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError('Refresh token inválido', 401);
      }

      const newPayload: JwtPayload = { userId: user.id, role: user.role as 'admin' | 'customer' };
      const accessToken = jwt.sign(newPayload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });

      return { accessToken };
    } catch {
      throw new AppError('Refresh token inválido o expirado', 401);
    }
  }

  async logout(userId: number) {
    await this.userRepo.clearRefreshToken(userId);
  }
}
