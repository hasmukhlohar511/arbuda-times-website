import mongoose from "mongoose";
import { env } from "../config/env.js";
export const platformConnection = mongoose.createConnection();
export async function connectPlatformDatabase() {
  if (platformConnection.readyState !== 1) await platformConnection.openUri(env.MONGODB_URI, { dbName: env.PLATFORM_DATABASE });
  return platformConnection;
}
export const closePlatformDatabase = () => platformConnection.close();
