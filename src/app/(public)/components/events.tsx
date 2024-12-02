"use client";

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { EventCardSkeleton } from "@/components/shared/event-card-skeleton";
import { EventCard } from "@/components/shared/event-card";
import { PaginationBar } from "./pagination-bar";

import { getEventsByComplexQuery } from "@/lib/db/queries/event.query";

import type { EventsWithPaginationQuery, TimeFilterType } from "@/types";

export const Events = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") ?? "";
  const category = searchParams.get("category") ?? "";
  const period = searchParams.get("period");
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "9");

  const queries: EventsWithPaginationQuery = {
    query,
    categoryId: category,
    timeFilter: period as TimeFilterType,
    page,
    pageSize,
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["events", ...Object.values(queries)],
    queryFn: () => getEventsByComplexQuery(queries),
  });

  const handlePageChange = useCallback(
    (page: number) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("page", page.toString());
      router.push(`?${newSearchParams.toString()}`);
    },
    [router, searchParams]
  );

  if (isLoading || isFetching) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data || data.events.length === 0) {
    return (
      <div className="flex h-full justify-center min-h-[50vh] flex-col items-center gap-6">
        <h2 className="text-2xl font-bold md:text-4xl">No events found.</h2>
        <p className="text-muted-foreground">
          Try searching for something else.
        </p>
      </div>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <>
      {/* Event Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {data.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Pagination Bar */}
      <Suspense fallback={null}>
        <PaginationBar
          currentPage={data.metadata.currentPage}
          totalPages={data.metadata.totalPages}
          onPageChange={handlePageChange}
        />
      </Suspense>
    </>
  );
};
