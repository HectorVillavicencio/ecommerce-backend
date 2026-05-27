import { prisma } from '../config/prisma';
import { BaseRepository } from './BaseRepository';
import { CreateProductInput, UpdateProductInput } from '../dtos/product.dto';

export class ProductRepository extends BaseRepository<any, CreateProductInput, UpdateProductInput> {

  findAll() {
    return prisma.product.findMany({
      where:   { active: true },
      include: {
        category: true,
        variants: true,
        images:   { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  findById(id: number) {
    return prisma.product.findUnique({
      where:   { id },
      include: {
        category: true,
        variants: true,
        images:   { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  findBySlug(slug: string) {
    return prisma.product.findUnique({ where: { slug } });
  }

  create(dto: CreateProductInput) {
    return prisma.product.create({
      data: {
        name:        dto.name,
        slug:        dto.slug,
        description: dto.description,
        categoryId:  dto.categoryId,
        variants: {
          create: dto.variants.map(v => ({
            sku:        v.sku,
            price:      v.price,
            stock:      v.stock,
            attributes: v.attributes,
          })),
        },
        images: {                          // ← agregar esto
        create: (dto.images ?? []).map(img => ({
          url:       img.url,
          alt:       img.alt,
          sortOrder: img.sortOrder ?? 0,
          isPrimary: img.isPrimary ?? false,
        })),
      },
    },
      include: { category: true, 
      variants: true,
      images: { orderBy: { sortOrder: 'asc' } }, 
      }, 
    });
  }

  update(id: number, dto: UpdateProductInput) {
    return prisma.product.update({
      where:   { id },
      data:    { name: dto.name, slug: dto.slug, description: dto.description },
      include: { category: true, variants: true },
    });
  }

  async delete(id: number) {
    await prisma.product.update({ where: { id }, data: { active: false } });
  }
}
