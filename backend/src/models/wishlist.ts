import { type Connection, type Model, Schema } from "mongoose";

export type WishlistItemRecord = {
  customerId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
};

const wishlistItemSchema = new Schema<WishlistItemRecord>({
  customerId: { type: Schema.Types.ObjectId, required: true, ref: "Customer", index: true },
  productId: { type: Schema.Types.ObjectId, required: true, ref: "Product", index: true },
}, { timestamps: true });
wishlistItemSchema.index({ customerId: 1, productId: 1 }, { unique: true });

export function getWishlistModel(connection: Connection) {
  return (connection.models.WishlistItem as Model<WishlistItemRecord> | undefined) ?? connection.model<WishlistItemRecord>("WishlistItem", wishlistItemSchema);
}
