"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AllOrdersResponseType } from "@/lib/db/queries/order.query";
import { formatPrice } from "@/utils/formatter";

type UniqueOrderData = {
  orderId: string;
  eventId: string;
  eventTitle: string;
  totalBookings: number;
  totalEarnings: string;
  organizersEarnings: string;
  platformsEarnings: string;
  uniqueTicketIds: Set<string>;
  uniqueTicketsCount: number;
};

export const transformOrders = (orders: AllOrdersResponseType["orders"]) => {
  const ordersMap = new Map<string, UniqueOrderData>();

  orders.forEach((order) => {
    const eventId = order.eventId;

    if (!ordersMap.has(eventId)) {
      ordersMap.set(eventId, {
        orderId: order.id,
        eventId: order.eventId,
        eventTitle: order.eventTitle,
        totalBookings: 0,
        totalEarnings: order.financialDetails.totalEarnings!,
        organizersEarnings: order.financialDetails.organizersEarnings!,
        platformsEarnings: order.financialDetails.platformsEarnings!,
        uniqueTicketIds: new Set<string>(),
        uniqueTicketsCount: 0,
      });
    }

    const orderData = ordersMap.get(eventId);
    if (orderData) {
      // Add ticket quantity
      orderData.totalBookings += order.ticket?.quantity || 0;

      // Track unique ticket IDs
      if (order.ticket?.id) {
        orderData.uniqueTicketIds.add(order.ticket.id);
      }
    }
  });

  return Array.from(ordersMap.values()).map((order) => ({
    ...order,
    uniqueTicketsCount: order.uniqueTicketIds.size,
    totalBookings: order.totalBookings,
  }));
};

export const earningsColumns: ColumnDef<UniqueOrderData>[] = [
  {
    accessorKey: "eventTitle",
    header: "Event Title",
    cell: ({ row }) => (
      <div className="min-w-[140px]">{row.original.eventTitle}</div>
    ),
  },
  {
    sortingFn: "alphanumeric",
    accessorKey: "totalBookings",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Bookings
        <ArrowUpDownIcon />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.totalBookings}</div>
    ),
  },
  {
    id: "totalEarnings",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Earnings
        <ArrowUpDownIcon />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {formatPrice(row.original.totalEarnings)}
      </div>
    ),
  },
  {
    accessorKey: "platformsEarnings",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Platforms Earnings
        <ArrowUpDownIcon />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {formatPrice(row.original.platformsEarnings)}
      </div>
    ),
  },
  {
    accessorKey: "organizersEarnings",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Organizers Earnings
        <ArrowUpDownIcon />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {formatPrice(row.original.organizersEarnings)}
      </div>
    ),
  },
];
