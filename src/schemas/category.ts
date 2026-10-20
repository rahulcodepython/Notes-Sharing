import { z } from "zod";

export const createCategorySchema = z.object({ name: z.string().trim().min(1).max(40) });

export const categorySchema = z.object({ id: z.uuid(), name: z.string() });
export type Category = z.infer<typeof categorySchema>;

export const categoryWithCountSchema = categorySchema.extend({ noteCount: z.number().int() });
export type CategoryWithCount = z.infer<typeof categoryWithCountSchema>;
