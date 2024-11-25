"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";

const updateUser = async (data: FormData) => {
  try {
    const headerList = await headers();
    const name = data.get("name") as string;

    if (name.trim() === "") return;

    const { user } = await auth.api.updateUser({
      headers: headerList,
      body: {
        name,
      },
    });

    if (user) {
      revalidatePath("/profile");
      return {
        success: "Name updated successfully",
      };
    }
  } catch (err) {
    console.error(err);
    return {
      error: "Internal server error.",
    };
  }
};

const changeEmail = async (data: FormData) => {
  try {
    const headerList = await headers();
    const email = data.get("email") as string;

    if (email.trim() === "") return;

    const { status } = await auth.api.changeEmail({
      headers: headerList,
      body: {
        newEmail: email,
      },
    });
    if (status) {
      revalidatePath("/profile");
      return {
        success: "Email changed successfully",
      };
    }
    return {
      error: "Something went wrong. Please try again.",
    };
  } catch (error: unknown) {
    const errMsg = "Email is the same";

    if (error instanceof Error) {
      return {
        error: error.message.includes(errMsg)
          ? errMsg
          : "Internal server error",
      };
    }
  }
};

export { updateUser, changeEmail };
