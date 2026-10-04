import { type Connection, type Model, Schema } from "mongoose";
export type ProductRecord = {
  name: string; sku: string; slug: string; category: string; description: string; price: number;
  moq: number; increment: number; dialColour: string; strapMaterial: string; variants: string[];
  stockStatus: "In Stock" | "Out of Stock"; featured: boolean; newArrival: boolean;
  status: "draft" | "published"; archived: boolean; coverImage?: string | null; images: string[];
};
const productSchema = new Schema({
  name: { type: String, required: true, trim: true }, sku: { type: String, required: true, unique: true, trim: true, uppercase: true }, slug: { type: String, required: true, unique: true, lowercase: true },
  category: { type: String, required: true, trim: true, index: true }, description: { type: String, required: true }, price: { type: Number, required: true, min: 0 },
  moq: { type: Number, required: true, min: 1 }, increment: { type: Number, required: true, min: 1 }, dialColour: { type: String, required: true }, strapMaterial: { type: String, required: true },
  variants: { type: [String], required: true, default: [] }, stockStatus: { type: String, enum: ["In Stock", "Out of Stock"], required: true }, featured: { type: Boolean, default: false, index: true },
  newArrival: { type: Boolean, default: false }, status: { type: String, enum: ["draft", "published"], default: "draft", index: true }, archived: { type: Boolean, default: false, index: true },
  coverImage: { type: String, default: null }, images: { type: [String], default: [] },
}, { timestamps: true });
productSchema.index({ status: 1, archived: 1, updatedAt: -1 });
productSchema.index({ name: "text", sku: "text", description: "text" });
export const getProductModel = (connection: Connection): Model<ProductRecord> =>
  (connection.models.Product as Model<ProductRecord> | undefined) ?? connection.model<ProductRecord>("Product", productSchema);
