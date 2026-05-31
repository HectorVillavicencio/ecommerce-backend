import { z } from 'zod';

const VariantDto = z.object({
  sku:        z.string().min(2).max(60),
  price:      z.number().positive(),
  stock:      z.number().int().min(0),
  isActive:   z.boolean().default(true),   // ← NUEVO
  attributes: z.record(z.string()),
});

const ImageDto = z.object({
  url:       z.string().url('URL de imagen inválida'),
  alt:       z.string().max(120).optional(),
  sortOrder: z.number().int().min(0).default(0),
  isPrimary: z.boolean().default(false),
});

// ── Entrada crear ─────────────────────────────────────
export const CreateProductDto = z.object({
  name:        z.string().min(2).max(120),
  slug:        z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional(),
  categoryId:  z.number().int().positive(),
  variants:    z.array(VariantDto).min(1),
  images:      z.array(ImageDto).optional(),
});

export const UpdateProductDto = CreateProductDto.partial().extend({
  active: z.boolean().optional(),  // ← para ocultar/mostrar el producto
});

// ── Query params para búsqueda y filtros ──────────────
export const ProductQueryDto = z.object({
  search:     z.string().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  sort: z.enum([
    'price_asc',
    'price_desc',
    'date_asc',
    'date_desc',
    'name_asc',
    'name_desc',
  ]).optional().default('date_desc'),
  page:       z.coerce.number().int().min(1).default(1),
  limit:      z.coerce.number().int().min(1).max(100).default(20),
  active:     z.coerce.boolean().optional(), // filtrar activos/inactivos (solo admin)
});

// ── Respuesta ─────────────────────────────────────────
export const ProductResponseDto = z.object({
  id:          z.number(),
  name:        z.string(),
  slug:        z.string(),
  description: z.string().nullable(),
  active:      z.boolean(),
  category:    z.object({ id: z.number(), name: z.string() }),
  variants: z.array(z.object({
    id:         z.number(),
    sku:        z.string(),
    price:      z.number(),
    stock:      z.number(),
    isActive:   z.boolean(),
    attributes: z.record(z.string()),
  })),
  images: z.array(z.object({
    id:        z.number(),
    url:       z.string(),
    alt:       z.string().nullable(),
    sortOrder: z.number(),
    isPrimary: z.boolean(),
  })).optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

// ── Respuesta paginada ────────────────────────────────
export const PaginatedProductsDto = z.object({
  data:  z.array(ProductResponseDto),
  meta: z.object({
    total:       z.number(),
    page:        z.number(),
    limit:       z.number(),
    totalPages:  z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  }),
});

// ── Tipos inferidos ───────────────────────────────────
export type CreateProductInput  = z.infer<typeof CreateProductDto>;
export type UpdateProductInput  = z.infer<typeof UpdateProductDto>;
export type ProductQueryInput   = z.infer<typeof ProductQueryDto>;
export type ProductResponse     = z.infer<typeof ProductResponseDto>;
export type PaginatedProducts   = z.infer<typeof PaginatedProductsDto>;