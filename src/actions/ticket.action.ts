"use server";

import { db } from "@/lib/db/drizzle";
import { ticket } from "@/lib/db/schema";
import type { TicketStatus } from "@/types";
import { eq } from "drizzle-orm";

// When the event is cancelled, set all tickets to cancelled
export const updateTicketStatus = async (
  ticketId: string,
  status: TicketStatus
) => {
  try {
    await db.update(ticket).set({ status }).where(eq(ticket.id, ticketId));

    return {
      success: true,
    };
  } catch (err) {
    console.error("Error updating ticket status", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to update ticket status"
    );
  }
};
