import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

import type { FormUrlQueryParams, RemoveUrlQueryParams } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidImageUrl = (value: unknown): value is string | File => {
  if (typeof value === "string") {
    return (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("data:image/") ||
      value.startsWith("blob:")
    );
  } else if (value instanceof File) {
    return true;
  }
  return false;
};

export const convertFileToUrl = (file: File) => {
  return URL.createObjectURL(file);
};

export const generateSlug = async (text: string, addSuffix = false) => {
  if (!text.trim()) return "";

  const baseSlug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const cryptoBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );

  const randomSuffix = Array.from(new Uint8Array(cryptoBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .slice(0, 6)
    .join("");

  return addSuffix ? `${baseSlug}-${randomSuffix}` : baseSlug;
};

export const formUrlQuery = ({ params, updates }: FormUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      currentUrl[key] = value;
    } else {
      delete currentUrl[key];
    }
  });

  return qs.stringify(currentUrl, {
    skipNull: true,
    skipEmptyString: true,
  });
};

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringify(currentUrl, {
    skipNull: true,
    skipEmptyString: true,
  });
};
