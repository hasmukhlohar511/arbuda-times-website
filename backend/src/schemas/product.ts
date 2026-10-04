import { z } from "zod";
export const productInput = z.object({
  name: z.string().trim().min(1).max(160), sku: z.string().trim().min(1).max(80), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180).optional(),
  category: z.string().trim().min(1).max(100), description: z.string().trim().min(1).max(10_000), price: z.number().nonnegative(), moq: z.number().int().positive(), increment: z.number().int().positive(),
  dialColour: z.string().trim().min(1).max(100), strapMaterial: z.string().trim().min(1).max(100), variants: z.array(z.string().trim().min(1).max(100)).max(100),
  stockStatus: z.enum(["In Stock", "Out of Stock"]), featured: z.boolean().default(false), newArrival: z.boolean().default(false), status: z.enum(["draft", "published"]).default("draft"),
  archived: z.boolean().default(false), coverImage: z.string().max(2_000).nullable().optional(), images: z.array(z.string().max(2_000)).max(30).default([]),
});
