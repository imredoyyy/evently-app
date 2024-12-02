"use server";

import { eq, sql } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import { ticket, event, ticketDetails } from "@/lib/db/schema";

const getTicketAvailability = async (eventId: string) => {
  try {
    const result = await db
      .select({
        totalQuantity: sql<number>`SUM(DISTINCT ${ticketDetails.totalQuantity})`,
        totalSold: sql<number>`SUM(${ticket.quantity})`,
      })
      .from(event)
      .innerJoin(ticketDetails, eq(ticketDetails.eventId, event.id))
      .leftJoin(ticket, eq(ticket.ticketDetailsId, ticketDetails.id))
      .groupBy(event.id)
      .having(eq(event.id, eventId));

    if (result.length === 0) {
      throw new Error("Event not found");
    }

    return {
      isSoldout: result[0].totalQuantity === result[0].totalSold,
      totalQuantity: result[0].totalQuantity,
      totalSold: result[0].totalSold,
      remainingTickets: result[0].totalQuantity - result[0].totalSold,
    };
  } catch (err) {
    console.error("Availability error", err);
    throw new Error(
      err instanceof Error ? err.message : "An unknown error occurred"
    );
  }
};

export { getTicketAvailability };
