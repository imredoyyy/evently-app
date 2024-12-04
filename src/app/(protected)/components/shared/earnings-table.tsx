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
import { Input } from "@/components/ui/input";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { earningsColumns } from "./earnings-column";

import useDebounce from "@/hooks/use-debounce";
import { getAllOrders } from "@/lib/db/queries/order.query";
import { transformOrders } from "./earnings-column";

export const EarningsTable = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageSize = 10;
  const [page, setPage] = useState(parseInt(searchParams.get("page") ?? "1"));
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["earnings", userId, page, pageSize],
    queryFn: () => getAllOrders(userId, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const [title, setTitle] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const MemoizedColumns = useMemo(() => earningsColumns, []);
  const MemoizedUniqueOrders = useMemo(() => {
    return transformOrders(data?.orders || []);
  }, [data?.orders]);
  const debouncedValue = useDebounce(title, 500);

  const table = useReactTable({
    data: MemoizedUniqueOrders,
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
    table.getColumn("eventTitle")?.setFilterValue(debouncedValue);
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
          You have no earnings at the moment. Keep working!
        </h2>
      </div>
    );
  }

  const totalPages = data.metadata.totalPages;

  return (
    <>
      <div className="space-y-6 overflow-x-hidden px-2">
        <h2 className="font-semibold text-2xl md:text-3xl">Earnings</h2>

        <div className="flex items-center justify-between py-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Filter by event title..."
            className="max-w-sm"
          />
        </div>

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
