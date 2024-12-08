"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import {
  event,
  NewEventType,
  order,
  ticketDetails,
  user,
} from "@/lib/db/schema";

import { EventFormValues } from "@/app/(protected)/zod-schemas";
import { getSession } from "@/utils/get-session";
import { redirect } from "next/navigation";
import { generateSlug } from "@/lib/utils";
import type { UpdateEventFormValues } from "@/types";
import { isAdminOrHost } from "@/lib/db/queries/event.query";

const createEvent = async (data: EventFormValues) => {
  try {
    const session = await getSession();

    // Session based validation
    if (
      !session ||
      (session?.user?.role !== "host" && session?.user?.role !== "admin")
    )
      redirect("/");

    const userId = session.user.id;

    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    // Database based validation
    if (!existingUser) {
      throw new Error("User not found");
    }

    if (existingUser.role !== "host" && existingUser.role !== "admin") {
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

const updateEvent = async (data: UpdateEventFormValues, eventId: string) => {
  try {
    const session = await getSession();

    if (
      !session ||
      (session?.user?.role !== "host" && session?.user?.role !== "admin")
    )
      redirect("/");

    const userId = session.user.id;

    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!existingUser) throw new Error("User not found");

    if (existingUser.role !== "host" && existingUser.role !== "admin")
      throw new Error("Unauthorized");

    const existingEvent = await db.query.event.findFirst({
      where: eq(event.id, eventId),
    });

    if (!existingEvent) throw new Error("Event not found");

    if (existingEvent.userId !== userId) throw new Error("Unauthorized");

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
        slug: data.slug ?? (await generateSlug(data.title, true)),
        startDate: data.startDateTime,
        endDate: data.endDateTime,
        userId,
      };

      const [updatedEvent] = await tx
        .update(event)
        .set(eventDetails)
        .where(eq(event.id, eventId))
        .returning();

      if (!updatedEvent) throw new Error("Failed to update event");

      // Update tickets and ensure all ticket updates are successful
      for (const ticket of data.tickets) {
        const [updatedTicketType] = ticket.id
          ? await tx
              .update(ticketDetails)
              .set({
                ...ticket,
                price: ticket.price?.toString(),
              })
              .where(eq(ticketDetails.id, ticket.id))
              .returning()
          : await tx
              .insert(ticketDetails)
              .values({
                ...ticket,
                eventId,
                price: ticket.price?.toString(),
                totalQuantity: ticket.quantity,
                availableQuantity: ticket.quantity,
              })
              .returning();

        if (!updatedTicketType)
          throw new Error("Failed to update ticket details");
      }
      return {
        success: "Event updated successfully",
      };
    });
  } catch (err) {
    console.error(err);
    return {
      error: err instanceof Error ? err.message : "Failed to update event",
    };
  }
};

const deleteEvent = async (eventId: string) => {
  try {
    return await db.transaction(async (tx) => {
      const session = await getSession();

      if (!session) throw new Error("No session found");

      const { isAdmin, isHost } = await isAdminOrHost(session.user.id);

      if (!isAdmin && !isHost)
        throw new Error("You are not authorized to delete this event");

      const whereCondition = isAdmin
        ? eq(event.id, eventId) // Admins can delete any event
        : and(eq(event.id, eventId), eq(event.userId, session.user.id)); // Hosts can delete their own

      // Check if the event exists
      const eventResult = await tx.query.event.findFirst({
        where: whereCondition,
      });

      if (!eventResult)
        throw new Error("Event not found or not authorized to delete");

      // Check for any associated orders to prevent deletion
      const ordersAssociatedWithEvent = await tx
        .select()
        .from(order)
        .where(eq(order.eventId, eventId));

      if (ordersAssociatedWithEvent.length > 0)
        throw new Error("This event has associated orders. Cannot delete");

      // Delete the event
      await tx.delete(event).where(eq(event.id, eventId));

      return { success: true };
    });
  } catch (err) {
    console.error("Error deleting event", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to delete event"
    );
  }
};

const cancelEvent = async (eventId: string) => {
  try {
    const session = await getSession();

    if (!session) throw new Error("No session found");

    const { isAdmin, isHost } = await isAdminOrHost(session.user.id);

    if (!isAdmin && !isHost)
      throw new Error("You are not authorized to cancel this event");

    const whereCondition = isAdmin
      ? eq(event.id, eventId) // Admins can cancel any event
      : and(eq(event.id, eventId), eq(event.userId, session.user.id)); // Hosts can cancel their own

    const [cancelledEvent] = await db
      .update(event)
      .set({ isCancelled: true })
      .where(whereCondition)
      .returning();

    if (!cancelledEvent) throw new Error("Failed to cancel event");

    return {
      success: true,
      event: cancelledEvent,
    };
  } catch (err) {
    console.error("Error canceling event", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to cancel event"
    );
  }
};

export { createEvent, updateEvent, deleteEvent, cancelEvent };
