import { type Connection, type Model, Schema } from "mongoose";

export type CustomerRecord = {
  email: string;
  passwordHash: string;
  name: string;
  active: boolean;
  emailVerified: boolean;
  lastLoginAt: Date;
};
export type CustomerSessionRecord = { customerId: Schema.Types.ObjectId; tokenHash: string; expiresAt: Date; lastUsedAt: Date };

const customerSchema = new Schema<CustomerRecord>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  name: { type: String, required: true, trim: true },
  active: { type: Boolean, required: true, default: true },
  emailVerified: { type: Boolean, required: true, default: false },
  lastLoginAt: { type: Date, required: true },
}, { timestamps: true });

const customerSessionSchema = new Schema<CustomerSessionRecord>({
  customerId: { type: Schema.Types.ObjectId, required: true, ref: "Customer", index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  lastUsedAt: { type: Date, required: true },
}, { timestamps: true });

export function getCustomerModels(connection: Connection) {
  return {
    Customer: (connection.models.Customer as Model<CustomerRecord> | undefined) ?? connection.model<CustomerRecord>("Customer", customerSchema),
    CustomerSession: (connection.models.CustomerSession as Model<CustomerSessionRecord> | undefined) ?? connection.model<CustomerSessionRecord>("CustomerSession", customerSessionSchema),
  };
}
