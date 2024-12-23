"use client";

import { useTransition } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowUpDownIcon,
  Loader2Icon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import { formatDateTime } from "@/utils/formatter";
import { copyToClipboard } from "@/utils/copy-clipboard";
import { cn } from "@/lib/utils";
import {
  useCancelEventModal,
  useDeleteEventModal,
} from "@/store/use-modal-store";
import { refundEventTickets } from "@/actions/payment.action";
import { deleteEvent } from "@/actions/event.action";
import type { GetOrganizedEventsResponseType } from "@/lib/db/queries/event.query";

export const eventsColumns: ColumnDef<
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
      // eslint-disable-next-line
      const { onOpen } = useCancelEventModal();
      // eslint-disable-next-line
      const { onDeleteModalOpen } = useDeleteEventModal();

      return (
        <>
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
              <DropdownMenuItem
                disabled={hasEventExpired || isCancelled}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpen(event.id);
                }}
              >
                Cancel Event
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                disabled={isCancelled || hasEventExpired}
              >
                <Link
                  href={`/edit-event/${event.id}`}
                  className="inline-flex w-full"
                >
                  Edit Event
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeleteModalOpen(event.id);
                }}
                className={cn("text-red-500")}
              >
                <Trash2Icon className="size-4" />
                Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export const CancelEventDialog = () => {
  const { isOpen, onClose, eventId } = useCancelEventModal();
  const [isPending, startTransition] = useTransition();

  const cancelEvent = () => {
    if (!eventId) return;

    startTransition(async () => {
      try {
        const res = await refundEventTickets(eventId);
        if (res.success) {
          onClose();
          toast.success(
            <>
              <p>Event cancelled successfully.</p>
              {res.failedRefunds > 0 && (
                <p>{res.failedRefunds} ticket(s) could not be refunded</p>
              )}
            </>
          );
        }
      } catch (err) {
        onClose();
        toast.error(
          err instanceof Error ? err.message : "Failed to cancel event"
        );
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to cancel this event?
          </AlertDialogTitle>
          <AlertDialogDescription>
            If you cancel this event, all tickets will be refunded. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={cancelEvent}
            disabled={isPending}
          >
            {isPending && <Loader2Icon className="size-4 animate-spin" />}
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const DeleteEventDialog = () => {
  const { open, onDeleteModalClose, eventId } = useDeleteEventModal();
  const [isPending, startTransition] = useTransition();

  const cancelEvent = () => {
    if (!eventId) return;

    startTransition(async () => {
      try {
        const res = await deleteEvent(eventId);
        if (res.success) {
          onDeleteModalClose();
          toast.success("Event delete successfully");
        }
      } catch (err) {
        onDeleteModalClose();
        toast.error(
          err instanceof Error ? err.message : "Failed to cancel event"
        );
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onDeleteModalClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this event?
          </AlertDialogTitle>
          <AlertDialogDescription>
            If you cancel this event, all tickets will be refunded. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={cancelEvent}
            disabled={isPending}
          >
            {isPending && <Loader2Icon className="size-4 animate-spin" />}
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
