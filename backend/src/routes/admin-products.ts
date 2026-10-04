import { Router } from "express";
import { getTenantConnection } from "../db/tenant.js";
import { asyncHandler } from "../lib/async-handler.js";
import { AppError } from "../lib/errors.js";
import { productJson, productSlug } from "../lib/products.js";
import { validateBody } from "../lib/validation.js";
import { requireUser, requireWebsiteRole } from "../middleware/auth.js";
import { getProductModel } from "../models/product.js";
import { productInput } from "../schemas/product.js";
export const adminProductsRouter = Router({ mergeParams: true });
adminProductsRouter.use(requireUser, requireWebsiteRole(["owner", "admin", "editor", "viewer"]));
adminProductsRouter.get("/", asyncHandler(async (req, res) => {
  const Product = getProductModel(await getTenantConnection(String(req.website!.databaseName)));
  const products = await Product.find().sort({ updatedAt: -1 }).lean();
  res.json({ data: products.map((p) => productJson(p as unknown as Record<string, unknown>)) });
}));
adminProductsRouter.post("/", requireWebsiteRole(["owner", "admin", "editor"]), validateBody(productInput), asyncHandler(async (req, res) => {
  const Product = getProductModel(await getTenantConnection(String(req.website!.databaseName)));
  const product = await Product.create({ ...req.body, slug: req.body.slug || productSlug(req.body.name) });
  res.status(201).json({ data: productJson(product.toObject() as Record<string, unknown>) });
}));
adminProductsRouter.put("/:id", requireWebsiteRole(["owner", "admin", "editor"]), validateBody(productInput), asyncHandler(async (req, res) => {
  const Product = getProductModel(await getTenantConnection(String(req.website!.databaseName)));
  const update = { ...req.body, ...(req.body.slug ? {} : { slug: productSlug(req.body.name) }) };
  const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!product) throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND"); res.json({ data: productJson(product.toObject() as Record<string, unknown>) });
}));
adminProductsRouter.delete("/:id", requireWebsiteRole(["owner", "admin"]), asyncHandler(async (req, res) => {
  const Product = getProductModel(await getTenantConnection(String(req.website!.databaseName)));
  if (!await Product.findByIdAndDelete(req.params.id)) throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND"); res.status(204).send();
}));
