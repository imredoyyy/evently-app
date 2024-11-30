"use server";

import { eq } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import { order, event, ticket, ticketDetails } from "@/lib/db/schema";

import type { CreateOrderParams } from "@/types";

const calculateFinancials = (totalAmountInCents: string) => {
  const amountInCents = parseFloat(totalAmountInCents);
  const rate = 0.01; // 1%
  const platformCommision = amountInCents * rate;
  const organizerEarning = amountInCents - platformCommision;

  return { platformCommision, organizerEarning };
};

export const createOrder = async (data: CreateOrderParams) => {
  try {
    return await db.transaction(async (tx) => {
      // 1. Create the order
      const [orderResult] = await tx
        .insert(order)
        .values({
          ...data,
          amount: data.totalAmountInCents,
          quantity: data.orderItems.reduce(
            (acc, item) => acc + item.quantity,
            0
          ),
        })
        .returning();

      if (!orderResult) throw new Error("Failed to create order");

      // 2. Create tickets and update the ticket details
      for (const item of data.orderItems) {
        // 2.1 Check if enough tickets are available
        const [ticketDetailsResult] = await tx
          .select()
          .from(ticketDetails)
          .where(eq(ticketDetails.id, item.ticketDetailsId));

        if (!ticketDetailsResult)
          throw new Error(
            `Ticket details not found for ticket ${item.ticketDetailsId}`
          );

        if (ticketDetailsResult.availableQuantity < item.quantity) {
          throw new Error(
            `Not enough tickets available for ticket ${item.ticketDetailsId}`
          );
        }

        // 2.2 Create the ticket
        const [ticketResult] = await tx
          .insert(ticket)
          .values({
            userId: data.userId,
            eventId: data.eventId,
            quantity: item.quantity,
            ticketDetailsId: item.ticketDetailsId,
            pricePerTicket: item.pricePerTicket,
            amount: (
              parseFloat(item.pricePerTicket) * item.quantity
            ).toString(),
          })
          .returning();

        if (!ticketResult) throw new Error("Failed to create ticket");

        // 2.3 Update the ticket details
        const [updatedTicketDetails] = await tx
          .update(ticketDetails)
          .set({
            availableQuantity:
              ticketDetailsResult.availableQuantity - item.quantity,
          })
          .where(eq(ticketDetails.id, item.ticketDetailsId))
          .returning();

        if (!updatedTicketDetails)
          throw new Error("Failed to update ticket details");
      }

      // 3. Get the event
      const [eventResult] = await tx
        .select()
        .from(event)
        .where(eq(event.id, data.eventId))
        .limit(1);

      if (!eventResult) throw new Error("Event not found");

      // 4. Calculate financials
      const { platformCommision, organizerEarning } = calculateFinancials(
        data.totalAmountInCents
      );

      // 5. Update the event with the financials data
      const [updatedEvent] = await tx
        .update(event)
        .set({
          platformsEarnings: (
            parseFloat(eventResult.platformsEarnings!) + platformCommision
          ).toString(),
          organizerEarnings: (
            parseFloat(eventResult.organizerEarnings!) + organizerEarning
          ).toString(),
          totalEarnings: (
            parseFloat(eventResult.totalEarnings!) +
            parseFloat(data.totalAmountInCents)
          ).toString(),
        })
        .where(eq(event.id, data.eventId))
        .returning();

      if (!updatedEvent) throw new Error("Failed to update event");

      return orderResult;
    });
  } catch (err) {
    console.error("Error creating order", err);
    throw err; // Re-throw to be handled by the caller
  }
};
