import { ProductRepository } from '../repositories/ProductRepository';
import { AppError }          from '../errors/AppError';
import { CreateProductInput, UpdateProductInput, ProductResponseDto } from '../dtos/product.dto';

export class ProductService {
  constructor(private readonly repo: ProductRepository) {}

  async findAll() {
    const products = await this.repo.findAll();
    return products.map(p => ProductResponseDto.parse(p));
  }

  async findById(id: number) {
    const product = await this.repo.findById(id);
    if (!product) throw new AppError('Producto no encontrado', 404);
    return ProductResponseDto.parse(product);
  }

  async create(dto: CreateProductInput) {
    // Regla: slug único
    const exists = await this.repo.findBySlug(dto.slug);
    if (exists) throw new AppError('El slug ya está en uso', 409);

    // Regla: todas las variantes deben tener precio positivo
    if (dto.variants.some(v => v.price <= 0)) {
      throw new AppError('El precio de todas las variantes debe ser mayor a 0', 422);
    }

    const product = await this.repo.create(dto);
    return ProductResponseDto.parse(product);
  }

  async update(id: number, dto: UpdateProductInput) {
    await this.findById(id); // lanza 404 si no existe
    const updated = await this.repo.update(id, dto);
    return ProductResponseDto.parse(updated);
  }

  async delete(id: number) {
    await this.findById(id);
    await this.repo.delete(id);
  }
}
