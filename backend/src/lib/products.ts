import type { ProductRecord } from "../models/product.js";

export function productJson(product: Record<string, unknown>) {
  const result: Record<string, unknown> = { ...product, id: String(product._id) };
  delete result._id;
  delete result.__v;
  return result as ProductRecord & { id: string };
}

export function productSlug(name: string) {
  return name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 160);
}
