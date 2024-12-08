"use client";

import { Suspense, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { bookingsColumns } from "./bookings-column";
import { Spinner } from "@/components/shared/spinner";
import { Input } from "@/components/ui/input";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { DataTable } from "@/components/ui/data-table";

import useDebounce from "@/hooks/use-debounce";
import { getAllOrders } from "@/lib/db/queries/order.query";
import type { Session } from "@/types";

export const BookingsTable = ({ session }: { session: Session }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageSize = 10;
  const [page, setPage] = useState(parseInt(searchParams.get("page") ?? "1"));
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["bookings", session!.user.id, page, pageSize],
    queryFn: () => getAllOrders(session!.user.id, page, pageSize),
    placeholderData: keepPreviousData,
  });
  const [email, setEmail] = useState("");

  const debouncedValue = useDebounce(email, 500);

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

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Filter by customer email"
              className="max-w-sm"
            />
          </div>

          <DataTable
            columns={bookingsColumns}
            data={data.orders}
            pagination={{
              page,
              pageSize,
            }}
            initialFilters={[
              {
                id: "customerEmail",
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
