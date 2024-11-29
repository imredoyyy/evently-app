"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { EventCardSkeleton } from "@/components/shared/event-card-skeleton";
import { EventCard } from "@/components/shared/event-card";
import Container from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

import { getEventsByComplexQuery } from "@/lib/db/queries/event.query";

export const UpcomingEvents = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: () => getEventsByComplexQuery({ pageSize: 8 }),
  });

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="w-20 h-6" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    );
  }

  if (!data || isError) {
    return null;
  }

  return (
    <Container id="upcoming-events">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold md:text-3xl">Upcoming Events</h2>
        <Link href="/events" className="flex items-center text-primary gap-x-1">
          <span>View All</span> <ArrowRightIcon className="size-4 shrink-0" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
        {data.events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
    </Container>
  );
};
