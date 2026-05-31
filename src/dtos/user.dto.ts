import { z } from 'zod';

export const UserProfileDto = z.object({
  firstName:  z.string().min(2).max(80),
  lastName:   z.string().min(2).max(80),
  phone:      z.string().max(20).optional(),
  street:     z.string().max(120).optional(),
  number:     z.string().max(20).optional(),
  city:       z.string().max(80).optional(),
  province:   z.string().max(80).optional(),
  country:    z.string().max(80).optional(),
  postalCode: z.string().max(20).optional(),
});

// Admin puede cambiar todo menos el email
export const AdminUpdateUserDto = z.object({
  role:      z.enum(['admin', 'customer']).optional(),
  isActive:  z.boolean().optional(),
  profile:   UserProfileDto.optional(),
});

// Usuario solo puede cambiar su perfil, no el email ni el rol
export const SelfUpdateUserDto = z.object({
  profile: UserProfileDto,
});

export const UserResponseDto = z.object({
  id:        z.number(),
  email:     z.string(),
  role:      z.enum(['admin', 'customer']),
  isActive:  z.boolean(),
  createdAt: z.date().or(z.string()),
  profile: z.object({
    firstName:  z.string(),
    lastName:   z.string(),
    phone:      z.string().nullable(),
    street:     z.string().nullable(),
    number:     z.string().nullable(),
    city:       z.string().nullable(),
    province:   z.string().nullable(),
    country:    z.string().nullable(),
    postalCode: z.string().nullable(),
  }).nullable(),
});

export type UserProfileInput      = z.infer<typeof UserProfileDto>;
export type AdminUpdateUserInput  = z.infer<typeof AdminUpdateUserDto>;
export type SelfUpdateUserInput   = z.infer<typeof SelfUpdateUserDto>;
export type UserResponse          = z.infer<typeof UserResponseDto>;