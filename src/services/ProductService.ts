import { ProductRepository }  from '../repositories/ProductRepository';
import { AppError }           from '../errors/AppError';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductQueryInput,
  ProductResponseDto,
} from '../dtos/product.dto';

export class ProductService {
  constructor(private readonly repo: ProductRepository) {}

  async findAll(query: ProductQueryInput) {
    const { products, total } = await this.repo.findAll(query);
    const { page, limit } = query;
    const totalPages = Math.ceil(total / limit);

    return {
      data: products.map(p => ProductResponseDto.parse(p)),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findById(id: number) {
    const product = await this.repo.findById(id);
    if (!product) throw new AppError('Producto no encontrado', 404);
    return ProductResponseDto.parse(product);
  }

  async create(dto: CreateProductInput) {
    const exists = await this.repo.findBySlug(dto.slug);
    if (exists) throw new AppError('El slug ya está en uso', 409);

    if (dto.variants.some(v => v.price <= 0)) {
      throw new AppError('El precio de todas las variantes debe ser mayor a 0', 422);
    }

    const product = await this.repo.create(dto);
    return ProductResponseDto.parse(product);
  }

  async update(id: number, dto: UpdateProductInput) {
    await this.findById(id);
    const updated = await this.repo.update(id, dto);
    return ProductResponseDto.parse(updated);
  }

  // Ocultar o mostrar un producto completo
  async toggleActive(id: number, active: boolean) {
    await this.findById(id);
    return this.repo.toggleActive(id, active);
  }

  // Ocultar o mostrar una variante individual
  async toggleVariantActive(productId: number, variantId: number, isActive: boolean) {
    await this.findById(productId); // verifica que el producto existe
    return this.repo.toggleVariantActive(variantId, isActive);
  }

  async delete(id: number) {
    await this.findById(id);
    await this.repo.delete(id);
  }
}