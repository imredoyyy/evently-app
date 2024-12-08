"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { Spinner } from "@/components/shared/spinner";
import { Input } from "@/components/ui/input";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { earningsColumns } from "./earnings-column";
import { DataTable } from "@/components/ui/data-table";

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

  const orders = useMemo(() => {
    return transformOrders(data?.orders || []);
  }, [data?.orders]);

  const debouncedValue = useDebounce(title, 500);

  const handlePageChange = useCallback(
    (page: number) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("page", page.toString());
      setPage(page);
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

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

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Filter by event title..."
              className="max-w-sm"
            />
          </div>

          <DataTable
            columns={earningsColumns}
            data={orders}
            pagination={{
              page,
              pageSize,
            }}
            initialFilters={[
              {
                id: "eventTitle",
                value: debouncedValue,
              },
            ]}
          />
        </div>

        <Suspense>
          <PaginationBar
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Suspense>
      </div>
    </>
  );
};
