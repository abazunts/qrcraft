import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlan extends Document {
  slug: "free" | "business" | "pro";
  price: number;
  currency: string;
  interval: "month" | null;
  maxQRCodes: number; // -1 = unlimited
  featureKeys: string[];
  isActive: boolean;
  isPopular: boolean;
}

const PlanSchema = new Schema<IPlan>({
  slug: { type: String, enum: ["free", "business", "pro"], required: true, unique: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  interval: { type: String, enum: ["month", null], default: null },
  maxQRCodes: { type: Number, required: true },
  featureKeys: [{ type: String }],
  isActive: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
});

const Plan: Model<IPlan> =
  mongoose.models.Plan ?? mongoose.model<IPlan>("Plan", PlanSchema);

export default Plan;
