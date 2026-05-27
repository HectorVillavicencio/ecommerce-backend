import { z } from 'zod';

// ── Entrada ───────────────────────────────────────────
export const LoginDto = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const RegisterDto = z.object({
  name:     z.string().min(2).max(80),
  email:    z.string().email(),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Debe tener mayúscula, minúscula y número',
    ),
});

export const RefreshTokenDto = z.object({
  refreshToken: z.string().min(1),
});

// ── Salida — nunca exponer password ──────────────────
export const UserResponseDto = z.object({
  id:        z.number(),
  name:      z.string(),
  email:     z.string(),
  role:      z.enum(['admin', 'customer']),
  createdAt: z.date(),
});

// ── Tipos inferidos ───────────────────────────────────
export type LoginInput       = z.infer<typeof LoginDto>;
export type RegisterInput    = z.infer<typeof RegisterDto>;
export type RefreshTokenInput= z.infer<typeof RefreshTokenDto>;
export type UserResponse     = z.infer<typeof UserResponseDto>;
