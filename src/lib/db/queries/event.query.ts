"use server";

import { and, desc, eq, gt, or, sql } from "drizzle-orm";

import {
  category,
  event,
  lowerCase,
  ticketDetails,
  user,
} from "@/lib/db/schema";
import { db } from "@/lib/db/drizzle";
import { getTimeCondition } from "@/utils/sql";

import { getTicketAvailability } from "@/lib/db/queries/ticket.query";

import type { EventsWithPaginationQuery } from "@/types";
import { EventFormValues } from "@/app/(protected)/zod-schemas";

const defalutQuery = {
  id: event.id,
  title: event.title,
  description: event.description,
  image: event.image,
  location: event.location,
  isFree: event.isFree,
  isOnline: event.isOnline,
  isCancelled: event.isCancelled,
  slug: event.slug,
  categoryId: category.id,
  categoryName: category.name,
  startDateTime: event.startDate,
  endDateTime: event.endDate,
  organizerId: user.id,
  organizerName: user.name,
};

const getEventsByComplexQuery = async ({
  query,
  categoryId,
  timeFilter,
  page = 1,
  pageSize = 9,
}: EventsWithPaginationQuery) => {
  try {
    // Helper function to create "WHERE" conditions
    const buildWhereConditions = () => {
      const conditions = [];

      if (query?.trim()) {
        const lowercaseQuery = query.trim().toLowerCase();
        conditions.push(
          or(
            sql`${lowerCase(event.title)} ILIKE ${`%${lowercaseQuery}%`}`,
            sql`${lowerCase(category.name)} ILIKE ${`%${lowercaseQuery}%`}`,
            sql`${lowerCase(event.location)} ILIKE ${`%${lowercaseQuery}%`}`
          )
        );
      }

      if (categoryId) {
        conditions.push(eq(event.categoryId, categoryId));
      }

      if (timeFilter) {
        const timeCondition = getTimeCondition(timeFilter);
        if (timeCondition) conditions.push(timeCondition);
      }

      return conditions;
    };

    const whereConditions = buildWhereConditions();

    // Query to fetch events with pagination
    const eventsQuery = await db
      .select({
        ...defalutQuery,
        total: sql<number>`COUNT(*) OVER()`,
      })
      .from(event)
      .innerJoin(category, eq(category.id, event.categoryId))
      .innerJoin(user, eq(user.id, event.userId))
      .where(
        and(
          ...whereConditions,
          eq(event.isCancelled, false), // Only show non-cancelled events
          gt(event.endDate, sql`NOW()`) // Only show events that haven't ended
        )
      )
      .orderBy(desc(event.createdAt), desc(event.id))
      .limit(pageSize + 1)
      .offset((page - 1) * pageSize);

    // Determine pagination metadata
    const total = eventsQuery[0]?.total || 0;
    const hasNextPage = eventsQuery.length > pageSize;
    const data = eventsQuery.slice(0, pageSize);

    return {
      events: data,
      metadata: {
        hasNextPage,
        nextCursor: hasNextPage ? data[data.length - 1].id : undefined,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (err) {
    console.error("Error fetching events:", err);
    throw new Error("Failed to fetch events.");
  }
};

const getEventBySlug = async (slug: string) => {
  try {
    const [eventResult] = await db
      .select({
        ...defalutQuery,
      })
      .from(event)
      .where(
        and(
          eq(event.slug, slug),
          eq(event.isCancelled, false),
          gt(event.endDate, sql`NOW()`)
        )
      )
      .innerJoin(category, eq(category.id, event.categoryId))
      .innerJoin(user, eq(user.id, event.userId))
      .limit(1);

    if (!eventResult) {
      throw new Error("Event not found");
    }

    const ticketDetailsResult = await db
      .select()
      .from(ticketDetails)
      .where(eq(ticketDetails.eventId, eventResult.id));
    const availability = await getTicketAvailability(eventResult.id);

    return {
      ...eventResult,
      ticketDetails: ticketDetailsResult,
      availability,
    };
  } catch (err) {
    console.error("Error fetching event:", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to fetch event."
    );
  }
};

const getEventById = async (id: string) => {
  try {
    const [eventResult] = await db
      .select({
        ...defalutQuery,
      })
      .from(event)
      .where(eq(event.id, id))
      .innerJoin(category, eq(category.id, event.categoryId))
      .innerJoin(user, eq(user.id, event.userId))
      .limit(1);

    if (!eventResult) {
      throw new Error("Event not found");
    }

    const ticketDetailsResult = await db
      .select()
      .from(ticketDetails)
      .where(eq(ticketDetails.eventId, id));

    return {
      ...eventResult,
      tickets: ticketDetailsResult,
    };
  } catch (err) {
    console.error("Error fetching event:", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to fetch event."
    );
  }
};

const getEventsByCategoryId = async (categoryId: string, eventId: string) => {
  try {
    const events = await db
      .select({ ...defalutQuery })
      .from(event)
      .innerJoin(category, eq(category.id, event.categoryId))
      .innerJoin(user, eq(user.id, event.userId))
      .where(
        and(
          eq(category.id, categoryId),
          eq(event.isCancelled, false),
          gt(event.endDate, sql`NOW()`)
        )
      )
      .limit(4);

    if (events.length === 0) return null;

    // Filter out the event with the given eventId
    return events.filter((event) => event.id !== eventId);
  } catch (err) {
    console.error("Error fetching events by category:", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to fetch events by category."
    );
  }
};

const getOrganizedEvents = async (
  userId: string,
  page: number,
  pageSize: number
) => {
  try {
    const { isAdmin, isHost } = await isAdminOrHost(userId);

    if (!isAdmin && !isHost) throw new Error("Unauthorized");

    const whereCondition = isAdmin ? undefined : eq(user.id, userId);

    const eventsQuery = await db
      .select({
        ...defalutQuery,
        organizerEmail: user.email,
        total: sql<number>`COUNT(*) OVER ()`,
      })
      .from(event)
      .innerJoin(category, eq(category.id, event.categoryId))
      .innerJoin(user, eq(user.id, event.userId))
      .where(whereCondition)
      .orderBy(desc(event.createdAt), desc(event.id))
      .limit(pageSize + 1)
      .offset((page - 1) * pageSize);

    const total = eventsQuery[0]?.total || 0;
    const hasNextPage = eventsQuery.length > pageSize;
    const data = eventsQuery.slice(0, pageSize);

    return {
      events: data,
      metadata: {
        hasNextPage,
        nextCursor: hasNextPage ? data[data.length - 1].id : undefined,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (err) {
    console.error("Error fetching events by category:", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to fetch events by category."
    );
  }
};

type PaginatedEventResponseType = Awaited<
  ReturnType<typeof getEventsByComplexQuery>
>;
type EventWithSlugResponseType = Awaited<ReturnType<typeof getEventBySlug>>;
type EventsWithCategoryResponseType = Awaited<
  ReturnType<typeof getEventsByCategoryId>
>;
type EventByIdResponseType = Awaited<ReturnType<typeof getEventById>>;
type GetOrganizedEventsResponseType = Awaited<
  ReturnType<typeof getOrganizedEvents>
>;

export {
  getEventsByComplexQuery,
  getEventBySlug,
  getEventById,
  getEventsByCategoryId,
  getOrganizedEvents,
};

export type {
  PaginatedEventResponseType,
  EventWithSlugResponseType,
  EventsWithCategoryResponseType,
  EventByIdResponseType,
  GetOrganizedEventsResponseType,
};

export const isAdminOrHost = async (userId: string) => {
  try {
    const userResult = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!userResult) throw new Error("User not found");

    return {
      isAdmin: userResult.role === "admin",
      isHost: userResult.role === "host",
    };
  } catch (err) {
    console.error("Error checking if user is admin or host:", err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "Failed to check if user is admin or host."
    );
  }
};
