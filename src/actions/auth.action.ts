"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";

export const signOut = async () => {
  const headerList = await headers();

  const { success } = await auth.api.signOut({
    headers: headerList,
  });

  if (success) {
    revalidatePath("/", "layout"); // Invalidate cache of entire site

    // Wait for the cache to invalidate before redirecting
    await new Promise((resolve) => setTimeout(resolve, 300));
    redirect("/sign-in");
  }
};
