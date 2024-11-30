"use server";

import { db } from "@/lib/db/drizzle";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const getUserById = async (id: string) => {
  try {
    const [userResult] = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (!userResult) {
      throw new Error("User not found");
    }

    return userResult;
  } catch (err) {
    console.error("Error getting user by id", err);
    throw err;
  }
};

export { getUserById };
