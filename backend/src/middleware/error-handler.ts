import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../lib/errors.js";
export const notFound: RequestHandler = (_req, _res, next) => next(new AppError(404, "Endpoint not found", "NOT_FOUND"));
export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const appError = error instanceof AppError ? error : new AppError(500, "Internal server error", "INTERNAL_ERROR");
  if (appError.status >= 500) req.log?.error({ err: error }, "request failed");
  res.status(appError.status).json({ error: { code: appError.code, message: appError.message } });
};
