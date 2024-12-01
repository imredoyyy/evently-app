import {
  CalendarDaysIcon,
  GlobeIcon,
  LucideIcon,
  MapPinCheckIcon,
  TagIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import type { EventWithSlugResponseType } from "@/lib/db/queries/event.query";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatPriceRange } from "@/utils/formatter";
import TicketSelectorModal from "./ticket-selector-modal";
import { TicketsCard } from "./tickets-card";

type Props = {
  event: EventWithSlugResponseType;
};

export const SingleEventDetails = ({ event }: Props) => {
  return (
    <>
      {/* Ticket selector modal */}
      <TicketSelectorModal event={event} />

      <div className="space-y-8">
        {/* Image */}

        <div className="relative min-h-[460px] md:min-h-[500px] h-full w-full overflow-hidden rounded-xl">
          <div
            style={{ backgroundImage: `url(${event.image})` }}
            className="absolute bg-no-repeat inset-0 bg-cover bg-center blur-lg scale-[1.2] after:content-['] after:absolute after:inset-0 after:bg-gradient-to-l after:from-[rgba(26,33,41,0.4)] after:to-[rgba(26,33,41,0.2)] after:blur-lg before:absolute before:inset-0 before:bg-gradient-to-r before:content-[''] before:from-[rgba(26,33,41,0.4)] before:to-[rgba(26,33,41,0.5)] before:blur-lg"
          />

          <div className="relative z-10 flex flex-col items-center px-4 py-16 mx-auto text-center gap-y-6 md:px-8 md:py-20">
            <div className="overflow-hidden rounded-xl">
              <Image
                src={event.image!}
                alt={event.title}
                width={400}
                height={400}
                className="w-full aspect-video max-w-[400px] object-cover rounded-lg h-full"
              />
            </div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl lg:text-4xl">
              {event.title}
            </h2>

            <ul className="flex flex-wrap items-center justify-center gap-4">
              <li className="cursor-default">
                <Badge className="gap-2 text-sm font-semibold text-primary bg-primary/15 hover:bg-primary/25">
                  <TagIcon className="size-4" />
                  <span>{event.categoryName}</span>
                </Badge>
              </li>
              <li className="cursor-default">
                {event.isOnline ? (
                  <Badge className="gap-2 leading-none transition-colors text-rose-500 bg-rose-500/15 hover:bg-rose-500/25">
                    <GlobeIcon className="size-4 shrink-0" />
                    <span>Online</span>
                  </Badge>
                ) : (
                  <Badge className="gap-2 bg-cyan-500/15 text-cyan-500 hover:bg-cyan-500/25">
                    <MapPinCheckIcon className="size-4 shrink-0" />
                    <span className="text-sm">{event.location}</span>
                  </Badge>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Event details */}
        <div className="relative flex flex-col w-full gap-8 px-4 md:px-8 lg:flex-row">
          <div className="flex flex-col gap-y-6 lg:w-3/5">
            <h2 className="text-2xl font-semibold leading-none md:text-3xl">
              {event.title}
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="gap-2 text-sm capitalize text-primary bg-primary/15 hover:bg-primary/15">
                  <TagIcon className="size-4" />
                  <span>{event.categoryName}</span>
                </Badge>
              </div>
              <p className="font-medium">
                Organized by{" "}
                <span className="text-primary">{event.organizerName}</span>
              </p>
            </div>

            {/* Event metadata. e.g. Date, Location, Ticket Price, Availability */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <EventMetadata icon={CalendarDaysIcon} label="Date & Time">
                <>
                  {formatDateTime(event.startDateTime).dateTime} -{" "}
                  {formatDateTime(event.endDateTime).dateTime}
                </>
              </EventMetadata>

              <EventMetadata icon={MapPinCheckIcon} label="Location">
                <>{event.location}</>
              </EventMetadata>
              <EventMetadata icon={TicketIcon} label="Ticket Price">
                <>
                  {event.isFree
                    ? "Free"
                    : formatPriceRange(event.ticketDetails)}
                </>
              </EventMetadata>
              <EventMetadata icon={UsersIcon} label="Availability">
                <>
                  {event.availability.remainingTickets}/
                  {event.availability.totalQuantity} left
                </>
              </EventMetadata>
            </div>

            {/* Tickets Card */}
            <TicketsCard event={event} className="lg:hidden" />

            {/* Event description */}
            <div className="flex flex-col gap-y-2">
              <h3 className="text-xl font-semibold leading-none md:text-2xl">
                About the event:
              </h3>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
          </div>

          {/*  Tickets Card for large screens */}
          <TicketsCard
            className="hidden lg:sticky lg:block lg:top-20 lg:w-2/5 lg:max-h-fit"
            event={event}
          />
        </div>
      </div>
    </>
  );
};

type EventMetadataProps = {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
};
const EventMetadata = ({ icon: Icon, label, children }: EventMetadataProps) => {
  return (
    <div className="flex flex-col p-4 text-sm border rounded-lg shadow-sm gap-y-2 bg-card">
      <div className="flex items-center gap-2">
        <Icon className="shrink-0 size-4 text-primary" />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <p>{children}</p>
    </div>
  );
};
