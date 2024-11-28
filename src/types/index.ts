import type { auth } from "@/lib/auth";
import { LucideIcon } from "lucide-react";

export type Session = typeof auth.$Infer.Session;

export type UserLinkType = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type TimeFilterType =
  | "today"
  | "tomorrow"
  | "this_week"
  | "next_week"
  | "upcoming";

export type EventsQuery = {
  query?: string;
  categoryName?: string;
  timeFilter?: TimeFilterType;
};

export type EventsWithPaginationQuery = EventsQuery & {
  page?: number;
  pageSize?: number;
};

export type PaginatedResponse<T> = {
  results: T[];
  metadata: {
    hasNextPage: boolean;
    nextCursor?: string;
    total: number;
    currentPage?: number;
    totalPages?: number;
  };
};
