"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarPlus2Icon } from "lucide-react";

import {
  flexRender,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { eventsColumns } from "./events-column";
import { Button } from "@/components/ui/button";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { Spinner } from "@/components/shared/spinner";

import { getOrganizedEvents } from "@/lib/db/queries/event.query";

export const EventsTable = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page") ?? "1"));
  const pageSize = 15;
  const { data, isError, isLoading } = useQuery({
    queryKey: ["organized-events", userId, page, pageSize],
    queryFn: () => getOrganizedEvents(userId, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const MemoizedColumns = useMemo(() => eventsColumns, []);
  const MemoizedEvents = useMemo(() => data?.events || [], [data]);

  const table = useReactTable({
    data: MemoizedEvents,
    columns: MemoizedColumns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      pagination: { pageIndex: page, pageSize },
    },
  });

  const { rows } = table.getRowModel();

  const handlePageChange = useCallback(
    (page: number) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("page", page.toString());
      setPage(page);
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (data?.metadata.currentPage && page !== data?.metadata.currentPage) {
      setPage(data?.metadata.currentPage);
    }
  }, [data?.metadata.currentPage, page]);

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

  if (isLoading) {
    return <Spinner />;
  }

  if (!data || data.events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[90vh]">
        <h2 className="font-semibold text-3xl text-center">
          You don&apos;t have any events
        </h2>
        <Button asChild size="lg" className="mt-6">
          <Link href="/create-event">Create an Event</Link>
        </Button>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <h2 className="font-semibold text-3xl text-center">
          Something went wrong
        </h2>
      </div>
    );
  }

  const totalPages = data?.metadata.totalPages;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="font-semibold text-2xl md:text-3xl">My Events</h2>
          <Button size="lg" asChild>
            <Link href="/create-event">
              <span>Create Event</span>
              <CalendarPlus2Icon />
            </Link>
          </Button>
        </div>
        <div className="overflow-hidden border rounded-xl">
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
                    No events found...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Suspense>
        <PaginationBar
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Suspense>
    </>
  );
};
