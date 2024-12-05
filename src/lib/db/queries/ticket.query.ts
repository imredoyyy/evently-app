"use server";

import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import { ticket, event, ticketDetails, order, user } from "@/lib/db/schema";

const defaultTicketQuery = {
  id: ticket.id,
  amount: ticket.amount,
  quantity: ticket.quantity,
  status: ticket.status,
  pricePerTicket: ticket.pricePerTicket,
  purchasedAt: ticket.purchasedAt,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
  },
  order: {
    id: order.id,
    eventId: order.eventId,
    amount: order.amount,
    quantity: order.quantity,
    status: order.status,
  },
  event: {
    id: event.id,
    title: event.title,
    image: event.image,
    location: event.location,
    isOnline: event.isOnline,
    isCancelled: event.isCancelled,
    startDate: event.startDate,
    endDate: event.endDate,
    isFree: event.isFree,
  },
  ticketDetails: {
    id: ticketDetails.id,
    name: ticketDetails.name,
    price: ticketDetails.price,
    quantity: ticket.quantity,
    totalQuantity: ticketDetails.totalQuantity,
  },
};

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

const getUserTickets = async (userId: string) => {
  try {
    const tickets = await db
      .select({
        ...defaultTicketQuery,
      })
      .from(ticket)
      .leftJoin(ticketDetails, eq(ticket.ticketDetailsId, ticketDetails.id))
      .innerJoin(event, eq(ticket.eventId, event.id))
      .innerJoin(order, eq(ticket.orderId, order.id))
      .innerJoin(user, eq(order.userId, user.id))
      .where(eq(ticket.userId, userId))
      .orderBy(desc(ticket.purchasedAt));

    if (tickets.length === 0) {
      throw new Error("No tickets found");
    }

    return tickets;
  } catch (err) {
    console.error("Error fetching users tickets:", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to get tickets."
    );
  }
};

const getTicketWithDetails = async (ticketId: string) => {
  try {
    const [ticketResult] = await db
      .select({
        ...defaultTicketQuery,
      })
      .from(ticket)
      .leftJoin(ticketDetails, eq(ticket.ticketDetailsId, ticketDetails.id))
      .innerJoin(event, eq(ticket.eventId, event.id))
      .innerJoin(order, eq(ticket.orderId, order.id))
      .innerJoin(user, eq(order.userId, user.id))
      .where(eq(ticket.id, ticketId))
      .limit(1);

    if (!ticketResult) {
      throw new Error("Ticket not found");
    }

    return ticketResult;
  } catch (err) {
    console.error("Error fetching ticket by id:", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to get ticket."
    );
  }
};

export { getTicketAvailability, getUserTickets, getTicketWithDetails };
