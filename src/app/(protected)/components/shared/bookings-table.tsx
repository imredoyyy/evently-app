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
import { bookingsColumns } from "./bookings-column";
import { Spinner } from "@/components/shared/spinner";
import { Input } from "@/components/ui/input";
import { PaginationBar } from "@/components/shared/pagination-bar";

import useDebounce from "@/hooks/use-debounce";
import { getAllOrders } from "@/lib/db/queries/order.query";
import type { Session } from "@/types";

export const BookingsTable = ({ session }: { session: Session }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageSize = 10;
  const [page, setPage] = useState(parseInt(searchParams.get("page") ?? "1"));
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["bookings", page, pageSize],
    queryFn: () => getAllOrders(session!.user.id, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const [email, setEmail] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const MemoizedColumns = useMemo(() => bookingsColumns, []);
  const MemoizedEvents = useMemo(() => data?.orders || [], [data]);
  const debouncedValue = useDebounce(email, 500);

  const table = useReactTable({
    data: MemoizedEvents,
    columns: MemoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      pagination: { pageIndex: page, pageSize },
    },
  });

  const { rows } = table.getRowModel();

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
    table.getColumn("customerEmail")?.setFilterValue(debouncedValue);
  }, [table, debouncedValue]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (!data) {
    return (
      <div className="min-h-screen grid place-items-center w-full">
        <h2 className="text-2xl font-semibold md:text-3xl">
          You have no bookings
        </h2>
      </div>
    );
  }

  const totalPages = data.metadata.totalPages;

  return (
    <>
      <div className="space-y-6 overflow-x-hidden px-2">
        <h2 className="font-semibold text-2xl md:text-3xl">
          {session.user.role === "admin" ? "All Bookings" : "My Bookings"}
        </h2>

        <div className="flex items-center justify-between py-4">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Filter by customer email"
            className="max-w-sm"
          />
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table className="overflow-hidden">
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

      {/* Pagination. If no rows(in case of filtering results are empty), do not show pagination */}
      {table.getRowModel().rows.length > 0 && (
        <Suspense>
          <PaginationBar
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Suspense>
      )}
    </>
  );
};
