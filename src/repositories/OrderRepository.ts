import { prisma }          from '../config/prisma';
import { CreateOrderInput } from '../dtos/order.dto';

export class OrderRepository {

  findAll(query: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = query;
    const skip  = (page - 1) * limit;
    const where = { ...(status && { status: status as any }) };

    return Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take:    limit,
        include: {
          user:  { include: { profile: true } },
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);
  }

  findById(id: number) {
    return prisma.order.findUnique({
      where:   { id },
      include: {
        user:  { include: { profile: true } },
        items: true,
      },
    });
  }

  findByUser(userId: number) {
    return prisma.order.findMany({
      where:   { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: number, dto: CreateOrderInput, itemsData: any[]) {
    // Calcular total con los precios actuales
    const total = itemsData.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return prisma.order.create({
      data: {
        userId,
        total,
        items: { create: itemsData },
      },
      include: {
        user:  { include: { profile: true } },
        items: true,
      },
    });
  }

  updateStatus(id: number, status: string, pdfUrl?: string) {
    return prisma.order.update({
      where: { id },
      data: {
        status: status as any,
        ...(pdfUrl && { pdfUrl }),
      },
      include: {
        user:  { include: { profile: true } },
        items: true,
      },
    });
  }

  // Descuenta stock — se ejecuta en transacción
  async confirmAndReduceStock(orderId: number) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where:   { id: orderId },
        include: { items: true },
      });

      if (!order) throw new Error('Orden no encontrada');
      if (order.status !== 'pending') throw new Error('La orden no está en estado pendiente');

      // Verificar stock antes de descontar
      for (const item of order.items) {
        const variant = await tx.variant.findUnique({ where: { id: item.variantId } });
        if (!variant) throw new Error(`Variante ${item.variantId} no encontrada`);
        if (variant.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${item.productName}`);
        }
      }

      // Descontar stock
      for (const item of order.items) {
        await tx.variant.update({
          where: { id: item.variantId },
          data:  { stock: { decrement: item.quantity } },
        });
      }

      // Confirmar orden
      return tx.order.update({
        where:   { id: orderId },
        data:    { status: 'confirmed' },
        include: { user: { include: { profile: true } }, items: true },
      });
    });
  }
}