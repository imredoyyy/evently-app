"use server";

import { eq } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import { event, NewEventType, ticketDetails, user } from "@/lib/db/schema";

import { EventFormValues } from "@/app/(protected)/zod-schemas";
import { getSession } from "@/utils/get-session";
import { redirect } from "next/navigation";
import { generateSlug } from "@/lib/utils";

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

export { createEvent };
