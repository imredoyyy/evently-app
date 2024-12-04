"use server";

import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import { order, event, user, ticket, ticketDetails } from "@/lib/db/schema";

import { isAdminOrHost } from "@/lib/db/queries/event.query";

const defaultOrderQuery = {
  id: order.id,
  eventId: order.eventId,
  userId: order.userId,
  eventTitle: event.title,
  customerEmail: user.email,
  quantity: order.quantity,
  amount: order.amount,
  status: order.status,
  purchasedAt: order.purchasedAt,
  financialDetails: {
    totalEarnings: event.totalEarnings,
    organizersEarnings: event.organizerEarnings,
    platformsEarnings: event.platformsEarnings,
  },
  ticketDetails: {
    id: ticketDetails.id,
    name: ticketDetails.name,
    price: ticketDetails.price,
  },
  ticket: {
    id: ticket.id,
    status: ticket.status,
    amount: ticket.amount,
    quantity: ticket.quantity,
    pricePerTicket: ticket.pricePerTicket,
    purchasedAt: ticket.purchasedAt,
  },
};

const getAllOrders = async (userId: string, page: number, pageSize: number) => {
  try {
    const { isAdmin, isHost } = await isAdminOrHost(userId);

    if (!isAdmin && !isHost) throw new Error("Unauthorized");

    // Admin can fetch all orders and events.
    // Host can only fetch orders associated with their own events.
    const whereCondition = isAdmin ? undefined : eq(event.userId, userId);

    const toalBookingsQuery = db
      .select({
        eventId: event.id,
        totalBookings: sql<number>`COUNT(${ticket.id})`.as("totalBookings"),
      })
      .from(event)
      .leftJoin(ticket, eq(ticket.eventId, event.id))
      .groupBy(event.id)
      .as("totalBookingsQuery");

    const result = await db
      .select({
        ...defaultOrderQuery,
        financialDetails: {
          ...defaultOrderQuery.financialDetails,
          totalBookings: toalBookingsQuery.totalBookings,
        },
        total: sql<number>`COUNT(*) OVER ()`,
      })
      .from(order)
      .innerJoin(event, eq(order.eventId, event.id))
      .innerJoin(user, eq(order.userId, user.id))
      .leftJoin(
        ticket,
        and(eq(ticket.eventId, event.id), eq(ticket.orderId, order.id))
      )
      .leftJoin(ticketDetails, eq(ticket.ticketDetailsId, ticketDetails.id))
      .leftJoin(toalBookingsQuery, eq(toalBookingsQuery.eventId, event.id))
      .groupBy(
        order.id,
        event.id,
        user.id,
        ticket.id,
        ticketDetails.id,
        toalBookingsQuery.totalBookings
      )
      .where(whereCondition)
      .orderBy(desc(order.purchasedAt))
      .limit(pageSize + 1) // +1 to check if there are more pages
      .offset((page - 1) * pageSize);

    if (result.length === 0) throw new Error("No orders found");

    const total = result[0]?.total || 0;
    const hasNextPage = result.length > pageSize;
    const orders = hasNextPage ? result.slice(0, pageSize) : result;

    return {
      orders,
      metadata: {
        total,
        page,
        pageSize,
        hasNextPage,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (err) {
    console.error("Error fetching orders by user id:", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to fetch orders."
    );
  }
};

type AllOrdersResponseType = Awaited<ReturnType<typeof getAllOrders>>;

export { getAllOrders };

export type { AllOrdersResponseType };
