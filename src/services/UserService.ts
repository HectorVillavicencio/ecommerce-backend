import { UserRepository }        from '../repositories/UserRepository';
import { AppError }              from '../errors/AppError';
import { AdminUpdateUserInput, SelfUpdateUserInput, UserResponseDto } from '../dtos/user.dto';

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async findAll(query: { search?: string; page: number; limit: number }) {
    const [users, total] = await this.repo.findAll(query);
    const { page, limit } = query;
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: users.map(u => UserResponseDto.parse(u)),
      meta: { total, page, limit, totalPages },
    };
  }

  async findById(id: number) {
    const user = await this.repo.findById(id);
    if (!user || !user.isActive) throw new AppError('Usuario no encontrado', 404);
    return UserResponseDto.parse(user);
  }

  // Admin actualiza cualquier campo
  async adminUpdate(id: number, dto: AdminUpdateUserInput) {
    await this.findById(id);
    const updated = await this.repo.update(id, dto);
    return UserResponseDto.parse(updated);
  }

  // Usuario actualiza solo su propio perfil
  async selfUpdate(userId: number, dto: SelfUpdateUserInput) {
    const updated = await this.repo.update(userId, { profile: dto.profile });
    return UserResponseDto.parse(updated);
  }

  async delete(id: number) {
    await this.findById(id);
    await this.repo.delete(id);
  }
}