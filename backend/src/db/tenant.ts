import mongoose, { type Connection } from "mongoose";
import { env } from "../config/env.js";
const connections = new Map<string, Connection>();
export async function getTenantConnection(databaseName: string) {
  if (!/^[a-zA-Z0-9_-]{1,63}$/.test(databaseName)) throw new Error("Unsafe tenant database name");
  const existing = connections.get(databaseName);
  if (existing?.readyState === 1) return existing;
  const connection = mongoose.createConnection();
  await connection.openUri(env.MONGODB_URI, { dbName: databaseName });
  connections.set(databaseName, connection); return connection;
}
export async function closeTenantDatabases() { await Promise.all([...connections.values()].map((c) => c.close())); connections.clear(); }
