import mongoose, { Schema, Document, Model } from "mongoose";

export type QRType = "url" | "text" | "vcard" | "wifi" | "event";

export interface QRDesign {
  fgColor: string;
  bgColor: string;
  dotStyle: "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";
  cornerStyle: "square" | "rounded" | "dot";
}

export interface IQRCode extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  type: QRType;
  content: string;
  design: QRDesign;
  shortId: string;
  dataUrl?: string;
  scanCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const QRDesignSchema = new Schema<QRDesign>(
  {
    fgColor: { type: String, default: "#000000" },
    bgColor: { type: String, default: "#ffffff" },
    dotStyle: {
      type: String,
      enum: ["square", "rounded", "dots", "classy", "classy-rounded", "extra-rounded"],
      default: "square",
    },
    cornerStyle: {
      type: String,
      enum: ["square", "rounded", "dot"],
      default: "square",
    },
  },
  { _id: false }
);

const QRCodeSchema = new Schema<IQRCode>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["url", "text", "vcard", "wifi", "event"],
      default: "url",
    },
    content: { type: String, required: true },
    design: { type: QRDesignSchema, default: () => ({}) },
    shortId: { type: String, required: true, unique: true, index: true },
    dataUrl: { type: String },
    scanCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const QRCode: Model<IQRCode> =
  mongoose.models.QRCode ?? mongoose.model<IQRCode>("QRCode", QRCodeSchema);

export default QRCode;
