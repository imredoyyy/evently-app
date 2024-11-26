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

const deleteCategory = async (id: string) => {
  try {
    await db.delete(category).where(eq(category.id, id));
    return {
      success: "Category deleted successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: "Failed to delete category",
    };
  }
};

export { createCategory, getCategories, deleteCategory };
