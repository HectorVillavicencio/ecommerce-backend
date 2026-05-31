import { prisma }       from '../config/prisma';
import { BaseRepository } from './BaseRepository';
import { CreateProductInput, UpdateProductInput, ProductQueryInput } from '../dtos/product.dto';
import { Prisma } from '@prisma/client';

export class ProductRepository extends BaseRepository<any, CreateProductInput, UpdateProductInput> {

  async findAll(query: ProductQueryInput) {
    const { search, categoryId, sort, page, limit, active } = query;
    const skip = (page - 1) * limit;

    // ── Where ──────────────────────────────────────────
    const where: Prisma.ProductWhereInput = {
      // si no se pasa active explícitamente, solo muestra los activos
      active: active !== undefined ? active : true,
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { name:        { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // ── Order ──────────────────────────────────────────
    const orderBy = this.buildOrderBy(sort);

    // ── Ejecutar en paralelo ───────────────────────────
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          variants: {
            where:   { isActive: true },   // solo variantes activas al público
            orderBy: { price: 'asc' },
          },
          images: { orderBy: { sortOrder: 'asc' } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  findById(id: number) {
    return prisma.product.findUnique({
      where:   { id },
      include: {
        category: true,
        variants: { orderBy: { price: 'asc' } },
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
            isActive:   v.isActive ?? true,
            attributes: v.attributes,
          })),
        },
        images: {
          create: (dto.images ?? []).map(img => ({
            url:       img.url,
            alt:       img.alt ?? null,
            sortOrder: img.sortOrder ?? 0,
            isPrimary: img.isPrimary ?? false,
          })),
        },
      },
      include: {
        category: true,
        variants: true,
        images:   { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  update(id: number, dto: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data: {
        ...(dto.name        && { name: dto.name }),
        ...(dto.slug        && { slug: dto.slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.categoryId  && { categoryId: dto.categoryId }),
        ...(dto.active      !== undefined && { active: dto.active }),
      },
      include: { category: true, variants: true, images: true },
    });
  }

  // Ocultar/mostrar producto (soft toggle)
  toggleActive(id: number, active: boolean) {
    return prisma.product.update({
      where: { id },
      data:  { active },
    });
  }

  // Ocultar/mostrar variante individual
  toggleVariantActive(variantId: number, isActive: boolean) {
    return prisma.variant.update({
      where: { id: variantId },
      data:  { isActive },
    });
  }

  async delete(id: number) {
    // Soft delete — solo oculta el producto
    await prisma.product.update({ where: { id }, data: { active: false } });
  }

  // ── Helper: ordenamiento ───────────────────────────
  private buildOrderBy(sort?: string): Prisma.ProductOrderByWithRelationInput {
    switch (sort) {
      case 'price_asc':  return { variants: { _count: 'asc'  } }; // aproximación
      case 'price_desc': return { variants: { _count: 'desc' } };
      case 'date_asc':   return { createdAt: 'asc'  };
      case 'date_desc':  return { createdAt: 'desc' };
      case 'name_asc':   return { name: 'asc'  };
      case 'name_desc':  return { name: 'desc' };
      default:           return { createdAt: 'desc' };
    }
  }
}