import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import type { CreateOrderParams, OrderItem } from "@/types";

import { createOrder } from "@/actions/order.action";

export const POST = async (req: Request) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook secret not found" },
      { status: 500 }
    );
  }

  try {
    const body = await req.text();
    const sig = (await headers()).get("Stripe-Signature");

    if (!sig) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { metadata } = session;

      if (!metadata?.userId || !metadata?.eventId || !metadata?.orderItems) {
        return NextResponse.json(
          { error: "Missing required metadata" },
          { status: 400 }
        );
      }

      const orderData: CreateOrderParams = {
        userId: metadata.userId,
        eventId: metadata.eventId,
        orderItems: JSON.parse(metadata.orderItems) as OrderItem[],
        totalAmount: session.amount_total
          ? (session.amount_total / 100).toString()
          : "0.00",
        status:
          session.payment_status === "paid" ||
          session.payment_status === "no_payment_required"
            ? "paid"
            : "pending",
      };

      const order = await createOrder(orderData);

      return NextResponse.json({ success: true, order }, { status: 201 });
    }

    return NextResponse.json(
      { success: false, error: `Unhandled event type: ${event.type}` },
      { status: 400 }
    );
  } catch (error) {
    console.error(`Webhook error: ${error}`);
    return NextResponse.json(
      { error: `Webhook processing failed: ${error}` },
      { status: 500 }
    );
  }
};
