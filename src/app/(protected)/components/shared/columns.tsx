"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ArrowUpDownIcon, MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { GetOrganizedEventsResponseType } from "@/lib/db/queries/event.query";
import { formatDateTime } from "@/utils/formatter";
import { copyToClipboard } from "@/utils/copy-clipboard";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<
  GetOrganizedEventsResponseType["events"][number]
>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "startDateTime",
    sortingFn: "datetime",

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Start Date
        <ArrowUpDownIcon />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px]">
        {formatDateTime(row.getValue("startDateTime")).dateTime}
      </div>
    ),
  },
  {
    accessorKey: "endDateTime",
    sortingFn: "datetime",

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        End Date
        <ArrowUpDownIcon />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px]">
        {formatDateTime(row.getValue("endDateTime")).dateTime}
      </div>
    ),
  },
  {
    id: "location",
    header: "Location",
    cell: ({ row }) => {
      const event = row.original;
      const location = event.isOnline ? "Online" : event.location;
      return <>{location}</>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const event = row.original;
      const hasEventExpired = new Date() > new Date(event.endDateTime);
      const isCancelled = event.isCancelled;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={async () => await copyToClipboard(event.id)}
            >
              Copy Event ID
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Link
                href={`/edit-event/${event.id}`}
                className={cn(
                  "inline-flex w-full",
                  (hasEventExpired || isCancelled) &&
                    "pointer-events-none text-muted-foreground"
                )}
              >
                Edit Event
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
