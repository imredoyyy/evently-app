"use server";

import { eq } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import { category, lowerCase } from "@/lib/db/schema";
import { generateSlug } from "@/lib/utils";

const createCategory = async (categoryName: string) => {
  try {
    if (!categoryName.trim()) {
      return {
        error: "Category name is required",
      };
    }

    const existingCategory = await db
      .select()
      .from(category)
      .where(eq(lowerCase(category.name), categoryName.toLocaleLowerCase()))
      .limit(1);

    if (existingCategory.length > 0) {
      return {
        error: "Category with this name already exists",
      };
    }

    const slug = await generateSlug(categoryName);

    const [newCategory] = await db
      .insert(category)
      .values({
        name: categoryName,
        slug,
      })
      .returning();

    if (!newCategory) {
      return {
        error: "Failed to create category",
      };
    }

    return {
      success: "Category created successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: "Internal server error",
    };
  }
};

export { createCategory };
