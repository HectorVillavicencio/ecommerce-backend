import { z } from 'zod';

const VariantDto = z.object({
  sku:        z.string().min(2).max(60),
  price:      z.number().positive('El precio debe ser positivo'),
  stock:      z.number().int().min(0, 'El stock no puede ser negativo'),
  attributes: z.record(z.string()), // { color: 'Negro', ram: '8GB', storage: '256GB' }
});

// ── Entrada ───────────────────────────────────────────
export const CreateProductDto = z.object({
  name:        z.string().min(2).max(120),
  slug:        z.string().regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  description: z.string().max(2000).optional(),
  categoryId:  z.number().int().positive(),
  variants:    z.array(VariantDto).min(1, 'Debe tener al menos una variante'),
    images:      z.array(z.object({        // ← agregar esto
    url:       z.string().url('URL inválida'),
    alt:       z.string().max(120).optional(),
    sortOrder: z.number().int().min(0).default(0),
    isPrimary: z.boolean().default(false),
  })).optional(),
});

export const UpdateProductDto = CreateProductDto.partial();

// ── Salida — campos explícitos ────────────────────────
export const ProductResponseDto = z.object({
  id:          z.number(),
  name:        z.string(),
  slug:        z.string(),
  description: z.string().nullable(),
  category:    z.object({ id: z.number(), name: z.string() }),
  variants: z.array(z.object({
    id:         z.number(),
    sku:        z.string(),
    price:      z.number(),
    stock:      z.number(),
    attributes: z.record(z.string()),
  })),
  images: z.array(z.object({
  id:        z.number(),
  url:       z.string(),
  alt:       z.string().nullable(),
  sortOrder: z.number(),
  isPrimary: z.boolean(),
  })).optional(),
});

// ── Tipos inferidos ───────────────────────────────────
export type CreateProductInput = z.infer<typeof CreateProductDto>;
export type UpdateProductInput = z.infer<typeof UpdateProductDto>;
export type ProductResponse    = z.infer<typeof ProductResponseDto>;
