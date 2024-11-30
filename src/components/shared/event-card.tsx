import Image from "next/image";
import Link from "next/link";
import {
  CalendarDaysIcon,
  GlobeIcon,
  MapPinCheckIcon,
  TagIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { PaginatedEventResponseType } from "@/lib/db/queries/event.query";
import { formatDateTime } from "@/utils/formatter";

interface EventResponse {
  event: PaginatedEventResponseType["events"][number];
  metadata?: PaginatedEventResponseType["metadata"];
}

export const EventCard = ({ event }: EventResponse) => {
  return (
    <Card
      style={{ gridRow: "span 5" }}
      className="overflow-hidden max-w-[350px] w-full p-0 group grid rounded-xl h-full grid-rows-subgrid mx-auto shadow-md hover:shadow-xl transition-all duration-300"
    >
      <CardContent
        style={{ gridRow: "span 5" }}
        className="relative grid gap-4 p-4 grid-rows-subgrid"
      >
        <Badge className="absolute z-10 px-4 py-1 font-normal capitalize top-2 left-6 hover:bg-primary">
          <TagIcon className="mr-2 size-4 shrink-0" />
          <span>{event.categoryName}</span>
        </Badge>

        <div className="w-full overflow-hidden rounded-lg">
          <Link href={`/events/${event.slug}`} title={event.title}>
            <Image
              src={event.image!}
              alt={event.title}
              width={350}
              height={Math.round(380 / (16 / 9))}
              className="object-cover w-full h-full transition-transform duration-300 md:group-hover:scale-105"
            />
          </Link>
        </div>

        <div className="flex flex-col gap-y-2">
          <Link
            href={`/events/${event.slug}`}
            className="font-semibold leading-none transition-colors duration-200 md:hover:text-primary line-clamp-2"
          >
            {event.title}
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <CalendarDaysIcon className="shrink-0 size-4" />
          <span>
            {formatDateTime(event.startDateTime).dateOnly} -{" "}
            {formatDateTime(event.endDateTime).dateOnly}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          {event.isOnline ? (
            <Badge className="gap-2 leading-none transition-colors text-rose-500 bg-rose-500/15 hover:bg-rose-500/25">
              <GlobeIcon className="mr-2 size-4 shrink-0" />
              <span>Online</span>
            </Badge>
          ) : (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPinCheckIcon className="size-4" />
              <span className="text-sm">{event.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">Organizer</p>
            <h3 className="font-medium leading-none">{event.organizerName}</h3>
          </div>

          <Button asChild>
            <Link href={`/events/${event.slug}`}>Get Ticket</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
