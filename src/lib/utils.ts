import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
