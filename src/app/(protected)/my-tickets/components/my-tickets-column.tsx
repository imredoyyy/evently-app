"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { GetUserTickets } from "@/lib/db/queries/ticket.query";

import { copyToClipboard } from "@/utils/copy-clipboard";
import Link from "next/link";

type UserTicket = GetUserTickets[number];

export const myTicketsColumns: ColumnDef<UserTicket>[] = [
  {
    accessorKey: "id",
    header: "Ticket Id",
  },
  {
    header: "Title",
    accessorKey: "event.title",
  },
  {
    accessorKey: "ticketDetails.name",
    header: "Ticket Name",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "pricePerTicket",
    header: "Price Per Ticket",
  },
  {
    accessorKey: "amount",
    header: "Total Amount",
  },
  {
    accessorKey: "status",
    header: "Ticket Status",
    cell: ({ row }) => {
      const ticket = row.original;
      const isPastEvent = ticket.event.endDate < new Date();
      return (
        <div className="capitalize">
          {isPastEvent ? "Expired" : ticket.status}
        </div>
      );
    },
  },
  {
    accessorKey: "order.status",
    header: "Order Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.order.status}</div>
    ),
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
          <DropdownMenuItem onClick={() => copyToClipboard(row.original.id)}>
            Copy Ticket ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => copyToClipboard(row.original.order.id)}
          >
            Copy Order ID
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/tickets/${row.original.id}`}>View Ticket</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
