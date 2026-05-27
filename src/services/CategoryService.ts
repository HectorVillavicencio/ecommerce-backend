import { CategoryRepository } from '../repositories/CategoryRepository';
import { AppError }           from '../errors/AppError';
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/category.dto';

export class CategoryService {
  constructor(private readonly repo: CategoryRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  async findById(id: number) {
    const cat = await this.repo.findById(id);
    if (!cat) throw new AppError('Categoría no encontrada', 404);
    return cat;
  }

  async create(dto: CreateCategoryInput) {
    const exists = await this.repo.findBySlug(dto.slug);
    if (exists) throw new AppError('El slug de categoría ya existe', 409);
    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateCategoryInput) {
    await this.findById(id);
    return this.repo.update(id, dto);
  }

  async delete(id: number) {
    await this.findById(id);
    await this.repo.delete(id);
  }
}
