"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
  ColumnFiltersState,
  ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  pagination?: {
    page: number;
    pageSize: number;
  };
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  pagination,
  initialFilters,
}: DataTableProps<TData, TValue> & { initialFilters?: ColumnFiltersState }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialFilters || []
  );

  const table = useReactTable({
    data: data || [],
    columns,
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
      pagination: {
        pageIndex: pagination?.page ?? 0,
        pageSize: pagination?.pageSize ?? 15,
      },
    },
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

  const handleFilter = useCallback(() => {
    if (initialFilters) {
      table
        .getColumn(initialFilters[0].id)
        ?.setFilterValue(initialFilters[0].value);
    }
  }, [initialFilters, table]);

  useEffect(() => {
    handleFilter();
  }, [handleFilter]);

  return (
    <div className="overflow-hidden border rounded-xl">
      <Table className="overflow-hidden">
        {MemoizedTableHeaders}
        <TableBody>
          {rows.length > 0 ? (
            <>{MemoizedTableRows}</>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nothing to display here...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
