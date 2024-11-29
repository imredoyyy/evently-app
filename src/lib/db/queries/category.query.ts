"use server";

import { db } from "@/lib/db/drizzle";
import { category } from "@/lib/db/schema";

const getCategories = async () => {
  try {
    const categories = await db.select().from(category);
    if (categories.length === 0) {
      return {
        error: "No categories found",
      };
    }

    return categories;
  } catch (err) {
    console.error(err);
    return {
      error: "Failed to fetch categories",
    };
  }
};

export { getCategories };
