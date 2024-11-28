import Image from "next/image";
import Link from "next/link";
import { GlobeIcon, MapPinCheckIcon, TagIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { PaginatedEventResponseType } from "@/actions/event.action";

interface EventResponse {
  event: PaginatedEventResponseType["events"][number];
  metadata?: PaginatedEventResponseType["metadata"];
}

export const EventCard = ({ event }: EventResponse) => {
  return (
    <Card
      style={{ gridRow: "span 4" }}
      className="overflow-hidden max-w-[350px] w-full p-0 group grid rounded-xl h-full grid-rows-subgrid mx-auto shadow-xl shadow-muted/10"
    >
      <CardContent
        style={{ gridRow: "span 4" }}
        className="grid relative gap-4 p-4 grid-rows-subgrid"
      >
        <Badge className="absolute top-2 left-6 z-10 px-4 py-1 font-normal hover:bg-primary capitalize">
          <TagIcon className="size-4 shrink-0 mr-2" />
          <span>{event.categoryName}</span>
        </Badge>

        <div className="overflow-hidden w-full rounded-lg">
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

        <div className="flex flex-wrap justify-between items-center">
          {event.isOnline ? (
            <Badge className="gap-2 leading-none text-rose-500 bg-rose-500/15 hover:bg-rose-500/25 transition-colors">
              <GlobeIcon className="size-4 mr-2 shrink-0" />
              <span>Online</span>
            </Badge>
          ) : (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPinCheckIcon className="size-4" />
              <span className="text-sm">{event.location}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
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
