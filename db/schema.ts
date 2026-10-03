import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const products = sqliteTable("products", {
  id: text("id").primaryKey(), name: text("name").notNull(), sku: text("sku").notNull().unique(), category: text("category").notNull(),
  description: text("description").notNull(), price: real("price").notNull(), moq: integer("moq").notNull(), increment: integer("increment").notNull(),
  dialColour: text("dial_colour").notNull(), strapMaterial: text("strap_material").notNull(), variants: text("variants").notNull(), stockStatus: text("stock_status").notNull(),
  featured: integer("featured", {mode:"boolean"}).notNull().default(false), newArrival: integer("new_arrival", {mode:"boolean"}).notNull().default(false),
  status: text("status").notNull().default("draft"), archived: integer("archived", {mode:"boolean"}).notNull().default(false), coverImage: text("cover_image"),
  images: text("images").notNull().default("[]"), createdAt: integer("created_at", {mode:"timestamp"}).notNull(), updatedAt: integer("updated_at", {mode:"timestamp"}).notNull(),
});
export const settings = sqliteTable("settings", { key:text("key").primaryKey(), value:text("value").notNull(), updatedAt:integer("updated_at",{mode:"timestamp"}).notNull() });
