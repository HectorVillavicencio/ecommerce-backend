import { prisma }             from '../config/prisma';
import { BaseRepository }     from './BaseRepository';
import { RegisterInput }      from '../dtos/auth.dto';
import { AdminUpdateUserInput } from '../dtos/user.dto';
import bcrypt from 'bcryptjs';

export class UserRepository extends BaseRepository<any, RegisterInput, AdminUpdateUserInput> {

  findAll(query: { search?: string; page: number; limit: number }) {
    const { search, page, limit } = query;
    const skip  = (page - 1) * limit;
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { email:   { contains: search, mode: 'insensitive' as const } },
          { profile: { firstName: { contains: search, mode: 'insensitive' as const } } },
          { profile: { lastName:  { contains: search, mode: 'insensitive' as const } } },
        ],
      }),
    };

    return Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: { profile: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
  }

  findById(id: number) {
    return prisma.user.findUnique({
      where:   { id },
      include: { profile: true },
    });
  }

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where:   { email },
      include: { profile: true },
    });
  }

  async create(dto: RegisterInput) {
    const hashed = await bcrypt.hash(dto.password, 12);
    return prisma.user.create({
      data: {
        email:    dto.email,
        password: hashed,
        role:     'customer',
      },
      include: { profile: true },
    });
  }

  update(id: number, dto: AdminUpdateUserInput) {
    return prisma.user.update({
      where: { id },
      data: {
        ...(dto.role     && { role:     dto.role }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.profile  && {
          profile: {
            upsert: {
              create: dto.profile,
              update: dto.profile,
            },
          },
        }),
      },
      include: { profile: true },
    });
  }

  // Soft delete
  async delete(id: number) {
    await prisma.user.update({ where: { id }, data: { isActive: false } });
  }

  saveRefreshToken(id: number, token: string) {
    return prisma.user.update({ where: { id }, data: { refreshToken: token } });
  }

  clearRefreshToken(id: number) {
    return prisma.user.update({ where: { id }, data: { refreshToken: null } });
  }
}