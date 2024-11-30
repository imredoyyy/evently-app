"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Stripe from "stripe";

import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

import type { CheckoutParams } from "@/types";

const createStripeCheckoutSession = async ({
  event,
  orderItems,
}: CheckoutParams) => {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) throw new Error("Not authenticated");

  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    orderItems.map((item) => {
      const priceCents = parseFloat(item.pricePerTicket) * 100;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${event.title} - ${item.ticketName}`,
            description: `Ticket Type: ${item.ticketName}`,
            images: [event.image!],
            metadata: {
              ticketDetailsId: item.ticketDetailsId,
              eventId: event.id,
            },
          },
          unit_amount: priceCents,
        },
        quantity: item.quantity,
      };
    });

  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: stripeLineItems,
    mode: "payment",
    expires_at: Math.floor(Date.now() / 1000) + 1800, // 30min
    success_url: `${process.env.NEXT_PUBLIC_URL}/tickets/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/events/${event.slug}`,
    metadata: {
      eventId: event.id,
      userId: session.user.id,
      orderItems: JSON.stringify(orderItems),
    },
  });

  redirect(checkoutSession.url!);
};

export { createStripeCheckoutSession };
