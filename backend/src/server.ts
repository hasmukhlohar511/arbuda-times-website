import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { closePlatformDatabase, connectPlatformDatabase } from "./db/platform.js";
import { closeTenantDatabases } from "./db/tenant.js";
await connectPlatformDatabase();
const server = createApp().listen(env.PORT, "0.0.0.0", () => console.log(`Arbuda platform API listening on port ${env.PORT}`));
async function shutdown(signal: string) { console.log(`${signal} received; shutting down`); server.close(async () => { await closeTenantDatabases(); await closePlatformDatabase(); process.exit(0); }); }
process.on("SIGINT", () => void shutdown("SIGINT")); process.on("SIGTERM", () => void shutdown("SIGTERM"));
