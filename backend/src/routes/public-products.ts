import { Router } from "express";
import { getTenantConnection } from "../db/tenant.js";
import { asyncHandler } from "../lib/async-handler.js";
import { AppError } from "../lib/errors.js";
import { productJson } from "../lib/products.js";
import { getProductModel } from "../models/product.js";
import { findActiveWebsite } from "../services/websites.js";
export const publicProductsRouter = Router({ mergeParams: true });
publicProductsRouter.get("/", asyncHandler(async (req, res) => {
  const website = await findActiveWebsite(String(req.params.siteSlug)); const Product = getProductModel(await getTenantConnection(String(website.databaseName)));
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const products = await Product.find({ status: "published", archived: false, ...(category ? { category } : {}) }).sort({ updatedAt: -1 }).lean(); res.json({ data: products.map((p) => productJson(p as unknown as Record<string, unknown>)) });
}));
publicProductsRouter.get("/:slug", asyncHandler(async (req, res) => {
  const website = await findActiveWebsite(String(req.params.siteSlug)); const Product = getProductModel(await getTenantConnection(String(website.databaseName)));
  const product = await Product.findOne({ slug: req.params.slug, status: "published", archived: false }).lean();
  if (!product) throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND"); res.json({ data: productJson(product as unknown as Record<string, unknown>) });
}));
