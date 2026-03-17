import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  image?: string;
  planId?: Types.ObjectId;
  liqpayOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    planId: { type: Schema.Types.ObjectId, ref: "Plan" },
    liqpayOrderId: { type: String },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
