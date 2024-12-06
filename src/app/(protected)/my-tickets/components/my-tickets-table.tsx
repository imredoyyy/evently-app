"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/shared/spinner";
import { myTicketsColumns } from "./my-tickets-column";

import { getUserTickets } from "@/lib/db/queries/ticket.query";

export const MyTicketsTable = ({ userId }: { userId: string }) => {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["my-tickets", userId],
    queryFn: () => getUserTickets(userId),
  });

  const MemoizedColumns = useMemo(() => myTicketsColumns, []);
  const MemoizedOrders = useMemo(() => tickets || [], [tickets]);

  const table = useReactTable({
    data: MemoizedOrders,
    columns: MemoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  const MemoizedTableHeaders = useMemo(
    () => (
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="whitespace-nowrap">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
    ),
    [table]
  );

  const MemoizedTableRows = useMemo(
    () =>
      rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      )),
    [rows]
  );

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

      <div className="overflow-hidden rounded-xl border">
        <Table className="overflow-hidden">
          {MemoizedTableHeaders}

          <TableBody>
            {rows.length > 0 ? (
              MemoizedTableRows
            ) : (
              <TableRow>
                <TableCell
                  colSpan={MemoizedColumns.length}
                  className="h-24 text-center"
                >
                  No bookings found..
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
