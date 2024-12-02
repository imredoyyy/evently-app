"use server";

import { db } from "@/lib/db/drizzle";
import { ticketDetails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const deleteTicket = async (ticketId: string) => {
  try {
    const [existingTicket] = await db
      .select()
      .from(ticketDetails)
      .where(eq(ticketDetails.id, ticketId))
      .limit(1);
    if (!existingTicket) throw new Error("Ticket not found");

    await db.delete(ticketDetails).where(eq(ticketDetails.id, ticketId));
  } catch (err) {
    console.error("Error deleteing ticket type", err);
    if (isErrorWithCode(err)) {
      if (err.code === "23503") {
        throw new Error(
          "Cannot delete ticket as it is associated with an order"
        );
      }
    }
    throw new Error("Failed to delete ticket");
  }
};

function isErrorWithCode(err: any): err is { code: string } {
  return err && typeof err.code === "string";
}
