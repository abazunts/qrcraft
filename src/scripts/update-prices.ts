import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const Plan = mongoose.model("Plan", new mongoose.Schema({}, { strict: false }));

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  await Plan.findOneAndUpdate({ slug: "pro" }, { price: 10.99 });
  await Plan.findOneAndUpdate({ slug: "business" }, { price: 5.99 });
  console.log("✓ pro → 10.99, business → 5.99");
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
