import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { AppError } from "./errors.js";
export const validateBody = (schema: ZodType): RequestHandler => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return next(new AppError(400, result.error.issues[0]?.message ?? "Invalid request", "VALIDATION_ERROR"));
  req.body = result.data; next();
};
