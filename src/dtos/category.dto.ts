import { z } from 'zod';

// ── Entrada ───────────────────────────────────────────
export const CreateCategoryDto = z.object({
  name:     z.string().min(2).max(80),
  slug:     z.string().regex(/^[a-z0-9-]+$/),
  parentId: z.number().int().positive().optional(), // null = categoría raíz
});

export const UpdateCategoryDto = CreateCategoryDto.partial();

// ── Salida ────────────────────────────────────────────
export const CategoryResponseDto = z.object({
  id:       z.number(),
  name:     z.string(),
  slug:     z.string(),
  parentId: z.number().nullable(),
  children: z.array(z.lazy((): z.ZodTypeAny => CategoryResponseDto)).optional(),
});

// ── Tipos inferidos ───────────────────────────────────
export type CreateCategoryInput = z.infer<typeof CreateCategoryDto>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategoryDto>;
export type CategoryResponse    = z.infer<typeof CategoryResponseDto>;
