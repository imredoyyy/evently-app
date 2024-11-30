import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET;

if (!stripeSecret) {
  throw new Error("STRIPE_SECRET environment variable is not set");
}

export const stripe = new Stripe(stripeSecret, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});
