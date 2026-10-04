import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";
import { adminProductsRouter } from "./routes/admin-products.js";
import { authRouter } from "./routes/auth.js";
import { customerAuthRouter } from "./routes/customer-auth.js";
import { healthRouter } from "./routes/health.js";
import { adminMediaRouter, publicMediaRouter } from "./routes/media.js";
import { publicProductsRouter } from "./routes/public-products.js";
import { wishlistRouter } from "./routes/wishlist.js";
export function createApp() {
  const app = express(); app.set("trust proxy", env.TRUST_PROXY);
  app.use(pinoHttp()); app.use(helmet()); app.use(cors({ origin: env.corsOrigins, credentials: true })); app.use(express.json({ limit: "1mb" })); app.use(cookieParser());
  app.use("/health", healthRouter); app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/sites/:siteSlug/auth", customerAuthRouter);
  app.use("/api/v1/sites/:siteSlug/products", publicProductsRouter);
  app.use("/api/v1/sites/:siteSlug/wishlist", wishlistRouter);
  app.use("/api/v1/admin/sites/:siteSlug/products", adminProductsRouter);
  app.use("/api/v1/admin/sites/:siteSlug/media", adminMediaRouter);
  app.use("/media/:siteSlug", publicMediaRouter);
  app.use(notFound); app.use(errorHandler); return app;
}
