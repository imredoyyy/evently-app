import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import type { CreateOrderParams } from "@/types";

import { createOrder } from "@/actions/order.action";

export const POST = async (req: Request) => {
  const body = await req.text();
  const sig = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  const webhookSecret = process.env.STRIPE_WEBHOOK;

  if (!webhookSecret) {
    throw new Error("Missing Stripe webhook secret");
  }

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe Webhook error: ", err);
    return NextResponse.json(
      { error: `Webhook error: ${err || "Internal server error"}` },
      { status: 500 }
    );
  }

  const session = event?.data?.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    try {
      // Get data from Stripe session
      const { id, amount_total, payment_status, metadata, customer } = session;
      console.log({ id, customer });

      if (!metadata?.userId || !metadata?.eventId || !metadata.orderItems) {
        return NextResponse.json(
          { error: "Missing required metadata" },
          { status: 400 }
        );
      }

      // Prepare order date
      const orderData: CreateOrderParams = {
        eventId: metadata.eventId,
        totalAmount: amount_total ? (amount_total / 100).toString() : "0.00",
        userId: metadata.userId,
        orderItems: JSON.parse(metadata.orderItems),
        status:
          payment_status === "paid" || payment_status === "no_payment_required"
            ? "paid"
            : "pending",
      };

      const order = await createOrder(orderData);

      console.log("Order creared");

      return NextResponse.json({ success: true, order }, { status: 200 });
    } catch (err) {
      console.error("Error creating order: ", err);
      return NextResponse.json(
        {
          success: false,
          error: "Error creating order: ",
          err,
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { success: false, error: `Unhandled event ${event.type}` },
    { status: 400 }
  );
};
