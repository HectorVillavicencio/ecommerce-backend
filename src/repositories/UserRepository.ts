import { prisma } from '../config/prisma';
import { BaseRepository } from './BaseRepository';
import { RegisterInput } from '../dtos/auth.dto';
import bcrypt from 'bcryptjs';

// Tipo local para no exponer el modelo Prisma directamente
export type UserRecord = {
  id:           number;
  name:         string;
  email:        string;
  password:     string;
  role:         string;
  refreshToken: string | null;
  createdAt:    Date;
};

export class UserRepository extends BaseRepository<UserRecord, RegisterInput, Partial<RegisterInput>> {

  findAll() {
    return prisma.user.findMany();
  }

  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(dto: RegisterInput) {
    const hashed = await bcrypt.hash(dto.password, 12);
    return prisma.user.create({
      data: {
        name:     dto.name,
        email:    dto.email,
        password: hashed,
        role:     'customer',
      },
    });
  }

  update(id: number, dto: Partial<RegisterInput>) {
    return prisma.user.update({ where: { id }, data: dto });
  }

  async delete(id: number) {
    await prisma.user.delete({ where: { id } });
  }

  saveRefreshToken(id: number, token: string) {
    return prisma.user.update({
      where: { id },
      data:  { refreshToken: token },
    });
  }

  clearRefreshToken(id: number) {
    return prisma.user.update({
      where: { id },
      data:  { refreshToken: null },
    });
  }
}
