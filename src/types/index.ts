import type { auth } from "@/lib/auth";
import { EventWithSlugResponseType } from "@/lib/db/queries/event.query";
import { EventType, OrderType } from "@/lib/db/schema";
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

export type OrderItem = {
  ticketDetailsId: string;
  ticketName: string;
  quantity: number;
  pricePerTicket: string;
};

export type CheckoutParams = {
  event: EventWithSlugResponseType;
  orderItems: OrderItem[];
};

export type CreateOrderParams = {
  userId: string;
  eventId: string;
  orderItems: OrderItem[];
  totalAmount: string;
  status: OrderType["status"];
};
