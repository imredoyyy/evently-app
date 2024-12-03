"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatDateTime, formatPrice } from "@/utils/formatter";
import { copyToClipboard } from "@/utils/copy-clipboard";

import type { AllOrdersResponseType } from "@/lib/db/queries/order.query";

export const bookingsColumns: ColumnDef<
  AllOrdersResponseType["orders"][number]
>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="min-w-[200px]">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "eventTitle",
    header: "Event Title",
    cell: ({ row }) => (
      <div className="min-w-[150px]">{row.getValue("eventTitle")}</div>
    ),
  },
  {
    accessorKey: "customerEmail",
    header: "Customer Email",
    cell: ({ row }) => (
      <div className="min-w-[120px]">{row.getValue("customerEmail")}</div>
    ),
  },
  {
    accessorKey: "ticketDetails.name",
    header: "Ticket Name",
  },
  {
    accessorKey: "ticket.quantity",
    header: "Quantity",
  },
  {
    accessorKey: "ticket.pricePerTicket",
    header: "Price Per Ticket",
    cell: ({ row }) => formatPrice(row.original.ticket?.pricePerTicket ?? 0),
  },
  {
    accessorKey: "ticket.amount",
    header: "Total Amount",
    cell: ({ row }) => formatPrice(row.original.ticket?.amount ?? 0),
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    sortingFn: "datetime",
    accessorKey: "purchasedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Purchased At
        <ArrowUpDownIcon />
      </Button>
    ),
    cell: ({ row }) => formatDateTime(row.getValue("purchasedAt")).dateTime,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open</span>
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => copyToClipboard(row.getValue("id"))}>
            Copy Order ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => copyToClipboard(row.getValue("eventId"))}
          >
            Copy Event ID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
