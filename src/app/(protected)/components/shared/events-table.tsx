"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarPlus2Icon } from "lucide-react";

import {
  CancelEventDialog,
  DeleteEventDialog,
  eventsColumns,
} from "./events-column";
import { Button } from "@/components/ui/button";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { Spinner } from "@/components/shared/spinner";

import { getOrganizedEvents } from "@/lib/db/queries/event.query";
import { DataTable } from "@/components/ui/data-table";

export const EventsTable = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page") ?? "1"));
  const pageSize = 10;
  const { data, isLoading } = useQuery({
    queryKey: ["organized-events", userId, page, pageSize],
    queryFn: () => getOrganizedEvents(userId, page, pageSize),
    placeholderData: keepPreviousData,
  });

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

  if (isLoading) {
    return <Spinner />;
  }

  if (!data) {
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

  const totalPages = data?.metadata.totalPages;

  return (
    <>
      <CancelEventDialog />
      <DeleteEventDialog />

      <div className="space-y-6 overflow-hidden px-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="font-semibold text-2xl md:text-3xl">My Events</h2>
          <Button size="lg" asChild>
            <Link href="/create-event">
              <span>Create Event</span>
              <CalendarPlus2Icon />
            </Link>
          </Button>
        </div>

        <DataTable
          columns={eventsColumns}
          data={data.events}
          pagination={{
            page,
            pageSize,
          }}
        />

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
