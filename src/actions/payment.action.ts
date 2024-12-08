"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Stripe from "stripe";

import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db/drizzle";
import { event, ticket } from "@/lib/db/schema";
import { updateTicketStatus } from "@/actions/ticket.action";
import { cancelEvent } from "@/actions/event.action";

import type { CheckoutParams } from "@/types";
import { eq } from "drizzle-orm";

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

const refundEventTickets = async (eventId: string) => {
  try {
    const existingEvent = await db.query.event.findFirst({
      where: eq(event.id, eventId),
    });

    if (!existingEvent) throw new Error("Event not found");

    const tickets = await db.query.ticket.findMany({
      where: eq(ticket.eventId, eventId),
    });

    const results = await Promise.allSettled(
      tickets.map(async (ticket) => {
        try {
          // If event is not free and ticket doesn't have paymentIntentId throw error.
          // If event is free just update ticket status to cancelled
          if (!existingEvent.isFree && !ticket.paymentIntentId) {
            throw new Error("Payment information not found");
          }

          // Only attempt to refund for non-free events
          if (!existingEvent.isFree) {
            await stripe.refunds.create({
              payment_intent: ticket.paymentIntentId!,
              reason: "requested_by_customer",
            });
          }

          await updateTicketStatus(ticket.id, "cancelled");

          return {
            success: true,
            ticketId: ticket.id,
          };
        } catch (err) {
          console.error("Error refunding ticket", err);
          return {
            success: false,
            ticketId: ticket.id,
            error:
              err instanceof Error ? err.message : "Failed to refund ticket",
          };
        }
      })
    );

    const failedRefunds = results.filter(
      (result) =>
        result.status === "rejected" ||
        (result.status === "fulfilled" && !result.value.success)
    );

    if (failedRefunds.length > 0) {
      console.error(`${failedRefunds.length} ticket refunds failed`);

      const errorDetails = failedRefunds.map((result) =>
        result.status === "rejected" ? result.reason : result.value.error
      );
      console.error("Failed refund details:", errorDetails);
    }

    await cancelEvent(eventId);

    return {
      success: true,
      totalTickets: tickets.length,
      failedRefunds: failedRefunds.length,
    };
  } catch (err) {
    console.error("Error refunding tickets", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to refund tickets"
    );
  }
};

export { createStripeCheckoutSession, refundEventTickets };
