"use client";

import { useQuery } from "@tanstack/react-query";

import { EventCard } from "@/components/shared/event-card";
import { EventCardSkeleton } from "@/components/shared/event-card-skeleton";
import { getEventsByCategoryId } from "@/lib/db/queries/event.query";
import Container from "@/components/layout/container";

type SimilarEventsProps = {
  categoryId: string;
  eventId: string;
};

export const SimilarEvents = ({ categoryId, eventId }: SimilarEventsProps) => {
  const {
    data: similarEvents,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["similar-events", categoryId, eventId],
    queryFn: () => getEventsByCategoryId(categoryId, eventId),
    enabled: !!categoryId && !!eventId,
  });

  if (isLoading) {
    return (
      <Container>
        <h2 className="text-xl font-semibold md:text-3xl">Similar Events</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    );
  }

  if (isError || !similarEvents || similarEvents.length === 0) {
    return null;
  }

  return (
    <Container>
      <h2 className="text-xl font-semibold md:text-3xl">Similar Events</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {similarEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </Container>
  );
};
