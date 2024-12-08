"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { Spinner } from "@/components/shared/spinner";
import { myTicketsColumns } from "./my-tickets-column";
import { DataTable } from "@/components/ui/data-table";

import { getUserTickets } from "@/lib/db/queries/ticket.query";

export const MyTicketsTable = ({ userId }: { userId: string }) => {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["my-tickets", userId],
    queryFn: () => getUserTickets(userId),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <Spinner />;

  if (!tickets) {
    return (
      <div className="min-h-[80vh] grid place-items-center w-full">
        <h2 className="text-2xl font-semibold md:text-3xl">
          You have no tickets
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-hidden px-2">
      <h2 className="font-semibold text-2xl md:text-3xl">My Tickets</h2>

      <DataTable columns={myTicketsColumns} data={tickets} />
    </div>
  );
};
