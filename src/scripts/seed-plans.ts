import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;

const PlanSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  price: Number,
  currency: String,
  interval: { type: String, default: null },
  maxQRCodes: Number,
  featureKeys: [String],
  isActive: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
});

const Plan = mongoose.models.Plan ?? mongoose.model("Plan", PlanSchema);

const plans = [
  {
    slug: "free",
    price: 0,
    currency: "EUR",
    interval: null,
    maxQRCodes: 5,
    featureKeys: ["plan.freeF1", "plan.freeF2", "plan.freeF3", "plan.freeF4"],
    isActive: true,
    isPopular: false,
  },
  {
    slug: "business",
    price: 5.99,
    currency: "EUR",
    interval: "month",
    maxQRCodes: 20,
    featureKeys: [
      "plan.businessF1",
      "plan.businessF2",
      "plan.businessF3",
      "plan.businessF4",
      "plan.businessF5",
    ],
    isActive: true,
    isPopular: false,
  },
  {
    slug: "pro",
    price: 10.99,
    currency: "EUR",
    interval: "month",
    maxQRCodes: -1,
    featureKeys: [
      "plan.proF1",
      "plan.proF2",
      "plan.proF3",
      "plan.proF4",
      "plan.proF5",
      "plan.proF6",
    ],
    isActive: true,
    isPopular: true,
  },
];

const UserSchema = new mongoose.Schema({
  email: String,
  plan: String,
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
}, { strict: false });
const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);

  const savedPlans: Record<string, { _id: mongoose.Types.ObjectId }> = {};
  for (const plan of plans) {
    const saved = await Plan.findOneAndUpdate({ slug: plan.slug }, plan, { upsert: true, new: true });
    savedPlans[plan.slug] = saved;
    console.log(`✓ Plan "${plan.slug}" upserted`);
  }

  // Migrate existing users: set planId from old plan slug field
  const usersWithOldPlan = await User.find({ plan: { $exists: true }, planId: { $exists: false } });
  for (const user of usersWithOldPlan) {
    const slug = user.plan === "pro" ? "pro" : "free";
    await User.findByIdAndUpdate(user._id, {
      planId: savedPlans[slug]._id,
      $unset: { plan: "" },
    });
  }
  console.log(`✓ Migrated ${usersWithOldPlan.length} user(s)`);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
