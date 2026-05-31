import { z } from 'zod';

export const CreateOrderDto = z.object({
  items: z.array(z.object({
    variantId: z.number().int().positive(),
    quantity:  z.number().int().min(1),
  })).min(1, 'La orden debe tener al menos un producto'),
});

export const UpdateOrderStatusDto = z.object({
  status: z.enum(['confirmed', 'cancelled']),
});

export const OrderResponseDto = z.object({
  id:        z.number(),
  status:    z.string(),
  total:     z.number(),
  pdfUrl:    z.string().nullable(),
  createdAt: z.date().or(z.string()),
  user: z.object({
    id:    z.number(),
    email: z.string(),
    profile: z.object({
      firstName: z.string(),
      lastName:  z.string(),
    }).nullable(),
  }),
  items: z.array(z.object({
    id:           z.number(),
    quantity:     z.number(),
    price:        z.number(),
    productName:  z.string(),
    variantAttrs: z.any(),
  })),
});

export type CreateOrderInput       = z.infer<typeof CreateOrderDto>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusDto>;
export type OrderResponse          = z.infer<typeof OrderResponseDto>;