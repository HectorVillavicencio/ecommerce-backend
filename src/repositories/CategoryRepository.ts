import { prisma } from '../config/prisma';
import { BaseRepository } from './BaseRepository';
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/category.dto';

export class CategoryRepository extends BaseRepository<any, CreateCategoryInput, UpdateCategoryInput> {

  findAll() {
    return prisma.category.findMany({
      where:   { parentId: null }, // solo raíces
      include: { children: true },
    });
  }

  findById(id: number) {
    return prisma.category.findUnique({
      where:   { id },
      include: { children: true, parent: true },
    });
  }

  findBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } });
  }

  create(dto: CreateCategoryInput) {
    return prisma.category.create({
      data: {
        name:     dto.name,
        slug:     dto.slug,
        parentId: dto.parentId ?? null,
      },
    });
  }

  update(id: number, dto: UpdateCategoryInput) {
    return prisma.category.update({ where: { id }, data: dto });
  }

  async delete(id: number) {
    await prisma.category.delete({ where: { id } });
  }
}
