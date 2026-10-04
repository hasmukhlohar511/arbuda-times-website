import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1).default("mongodb://localhost:27017"),
  PLATFORM_DATABASE: z.string().regex(/^[a-zA-Z0-9_-]+$/).default("arbuda_platform"),
  SESSION_COOKIE_NAME: z.string().min(1).default("arbuda_session"),
  SESSION_TTL_HOURS: z.coerce.number().positive().max(720).default(12),
  CORS_ORIGINS: z.string().default("http://localhost:3000,http://127.0.0.1:5173"),
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),
  API_PUBLIC_URL: z.url().default("http://127.0.0.1:4000"),
  MEDIA_ROOT: z.string().min(1).default("./data/media"),
  CUSTOMER_SESSION_COOKIE_NAME: z.string().min(1).default("arbuda_customer_session"),
  CUSTOMER_SESSION_TTL_DAYS: z.coerce.number().int().positive().max(365).default(30),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) throw new Error(`Invalid environment: ${z.prettifyError(parsed.error)}`);
export const env = { ...parsed.data, corsOrigins: parsed.data.CORS_ORIGINS.split(",").map((v) => v.trim()).filter(Boolean), isProduction: parsed.data.NODE_ENV === "production" };
