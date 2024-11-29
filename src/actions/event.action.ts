"use server";

import { and, desc, eq, gt, or, sql } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import {
  event,
  lowerCase,
  NewEventType,
  NewTicketDetailsType,
  ticketDetails,
  user,
  category,
} from "@/lib/db/schema";

import { EventFormValues } from "@/app/(protected)/zod-schemas";
import { getSession } from "@/utils/get-session";
import { redirect } from "next/navigation";
import { generateSlug } from "@/lib/utils";
import { getTimeCondition } from "@/utils/sql";
import { EventsWithPaginationQuery } from "@/types";
import { getTicketAvailability } from "@/actions/ticket.action";

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

const createEvent = async (data: EventFormValues) => {
  try {
    const session = await getSession();

    // Session based validation
    if (!session || session?.user?.role !== "host") redirect("/host-sign-in");

    const userId = session.user.id;

    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    // Database based validation
    if (!existingUser) {
      throw new Error("User not found");
    }

    if (existingUser.role !== "host") {
      throw new Error("Unauthorized");
    }

    // Validate ticket details
    for (const ticket of data.tickets) {
      if (data.isFree && ticket.price && ticket.price > 0) {
        return {
          error: "Free events can't have a price",
        };
      }

      if (!data.isFree && (!ticket.price || ticket.price <= 0)) {
        return {
          error: "Paid events must have a price",
        };
      }
    }

    return await db.transaction(async (tx) => {
      const eventDetails: NewEventType = {
        ...data,
        slug: await generateSlug(data.title, true),
        userId,
        startDate: data.startDateTime,
        endDate: data.endDateTime,
      };

      const [createdEvent] = await tx
        .insert(event)
        .values(eventDetails)
        .returning();

      if (!createdEvent) {
        // This will rollback the transaction
        throw new Error("Failed to create event");
      }

      // Insert tickets and ensure all ticket creations are successful
      for (const ticket of data.tickets) {
        const [createdTicketType] = await tx
          .insert(ticketDetails)
          .values({
            ...ticket,
            eventId: createdEvent.id,
            price: ticket.price?.toString(),
            totalQuantity: ticket.quantity,
            availableQuantity: ticket.quantity,
          })
          .returning();

        if (!createdTicketType) {
          // This will rollback the transaction
          throw new Error("Failed to create ticket type");
        }
      }

      return {
        success: "Event created successfully",
      };
    });
  } catch (err) {
    console.error(err);
    return {
      error: err instanceof Error ? err.message : "Failed to create event",
    };
  }
};

const getEventsByComplexQuery = async ({
  query,
  categoryName,
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

      if (categoryName) {
        conditions.push(
          eq(lowerCase(category.name), categoryName.toLowerCase())
        );
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

export const getEventBySlug = async (slug: string) => {
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

type PaginatedEventResponseType = Awaited<
  ReturnType<typeof getEventsByComplexQuery>
>;
type EventWithSlugResponseType = Awaited<ReturnType<typeof getEventBySlug>>;
export { createEvent, getEventsByComplexQuery };
export type { PaginatedEventResponseType, EventWithSlugResponseType };
