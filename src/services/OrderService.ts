import { OrderRepository }  from '../repositories/OrderRepository';
import { AppError }         from '../errors/AppError';
import { PdfService }       from './PdfService';
import { CreateOrderInput } from '../dtos/order.dto';
import { prisma }           from '../config/prisma';

export class OrderService {
  private pdfService = new PdfService();

  constructor(private readonly repo: OrderRepository) {}

  async findAll(query: { page: number; limit: number; status?: string }) {
    const [orders, total] = await this.repo.findAll(query);
    const { page, limit } = query;
    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages:  Math.ceil(total / limit) || 1,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async findById(id: number) {
    const order = await this.repo.findById(id);
    if (!order) throw new AppError('Orden no encontrada', 404);
    return order;
  }

  async findByUser(userId: number) {
    return this.repo.findByUser(userId);
  }

  async create(userId: number, dto: CreateOrderInput) {
    // Buscar variantes y armar los items con snapshot de datos
    const itemsData = await Promise.all(dto.items.map(async item => {
      const variant = await prisma.variant.findUnique({
        where:   { id: item.variantId },
        include: { product: true },
      });

      if (!variant)          throw new AppError(`Variante ${item.variantId} no encontrada`, 404);
      if (!variant.isActive) throw new AppError(`El producto no está disponible`, 422);
      if (variant.stock < item.quantity) {
        throw new AppError(`Stock insuficiente para ${variant.product.name}`, 422);
      }

      return {
        variantId:   variant.id,
        quantity:    item.quantity,
        price:       variant.price,                     // snapshot del precio actual
        productName: variant.product.name,              // snapshot del nombre
        variantAttrs: variant.attributes,               // snapshot de los atributos
      };
    }));

    const order = await this.repo.create(userId, dto, itemsData);

    // Generar PDF automáticamente al crear la orden
    const pdfUrl = await this.pdfService.generateOrderPdf(order);
    await this.repo.updateStatus(order.id, 'pending', pdfUrl);

    return { ...order, pdfUrl };
  }

  // Usuario cancela su propia orden
  async cancelByUser(orderId: number, userId: number) {
    const order = await this.findById(orderId);

    if (order.userId !== userId) throw new AppError('Sin permiso para cancelar esta orden', 403);
    if (order.status !== 'pending') {
      throw new AppError('Solo se pueden cancelar órdenes pendientes', 422);
    }

    return this.repo.updateStatus(orderId, 'cancelled');
  }

  // Admin confirma y descuenta stock
  async confirmByAdmin(orderId: number) {
    const order = await this.findById(orderId);
    if (order.status !== 'pending') {
      throw new AppError('Solo se pueden confirmar órdenes pendientes', 422);
    }
    return this.repo.confirmAndReduceStock(orderId);
  }

  // Admin cancela
  async cancelByAdmin(orderId: number) {
    const order = await this.findById(orderId);
    if (order.status === 'confirmed') {
      throw new AppError('No se puede cancelar una orden ya confirmada', 422);
    }
    return this.repo.updateStatus(orderId, 'cancelled');
  }
}