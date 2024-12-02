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
      { error: "Stripe webhook secret not configured" },
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

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error(
        `Webhook verification failed: ${err instanceof Error ? err.message : err}`
      );
      return NextResponse.json(
        { error: "Webhook verification failed" },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { metadata, payment_intent } = session;

      if (
        !metadata ||
        !metadata.userId ||
        !metadata.eventId ||
        !metadata.orderItems
      ) {
        return NextResponse.json(
          { error: "Missing required metadata" },
          { status: 400 }
        );
      }

      if (!payment_intent) {
        return NextResponse.json(
          { error: "Missing payment intent id" },
          { status: 400 }
        );
      }
      let orderItems: OrderItem[];
      try {
        orderItems = JSON.parse(metadata.orderItems) as OrderItem[];
      } catch (parseError) {
        console.error(`Error parsing orderItems: ${parseError}`);
        return NextResponse.json(
          { error: "Invalid order items format in metadata" },
          { status: 400 }
        );
      }

      const orderData: CreateOrderParams = {
        userId: metadata.userId,
        eventId: metadata.eventId,
        orderItems,
        totalAmount: session.amount_total
          ? (session.amount_total / 100).toFixed(2)
          : "0.00",
        status:
          session.payment_status === "paid" ||
          session.payment_status === "no_payment_required"
            ? "paid"
            : "pending",
        paymentIntentId: payment_intent as string,
      };

      try {
        const order = await createOrder(orderData);
        return NextResponse.json({ success: true, order }, { status: 201 });
      } catch (orderCreationError) {
        console.error(`Order creation error: ${orderCreationError}`);
        return NextResponse.json(
          { error: "Failed to create the order. Please try again." },
          { status: 500 }
        );
      }
    } else {
      console.warn(`Unhandled event type: ${event.type}`);
      return NextResponse.json({ success: false }, { status: 200 });
    }
  } catch (err) {
    console.error(`Webhook error: ${err instanceof Error ? err.message : err}`);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
};
