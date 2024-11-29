"use client";

import Link from "next/link";
import { TicketIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/formatter";
import { useTicketSelectorModal } from "@/store/use-modal-store";

import type { EventWithSlugResponseType } from "@/actions/event.action";

interface TicketsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  event: EventWithSlugResponseType;
}

export const TicketsCard = ({
  className,
  event,
  ...props
}: TicketsCardProps) => {
  const { data } = useSession();
  const { onOpen } = useTicketSelectorModal();
  const pathname = usePathname();

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle className="text-center">Get Your Tickets Now</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-4">
          {event.ticketDetails.map((ticket) => (
            <div
              key={ticket.id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm border-border/60 bg-primary-foreground"
            >
              <div className="space-y-2.5">
                <SingleTicketStatus ticket={ticket} />
                <p className="flex items-center text-sm text-muted-foreground gap-x-2">
                  <TicketIcon className="text-primary shrink-0 size-4" />
                  <span>
                    {event.availability.isSoldout ? (
                      "Sold Out"
                    ) : (
                      <>{ticket.availableQuantity} tickets remaining</>
                    )}
                  </span>
                </p>
              </div>

              <p className="font-medium text-primary">
                {event.isFree ? "Free" : formatPrice(ticket.price!)}
              </p>
            </div>
          ))}
        </div>

        {data?.session ? (
          data.session.userId === event.organizerId ? (
            <div className="p-2 mt-4 text-center text-red-500 rounded-md bg-red-500/15">
              You can&apos;t buy your own tickets
            </div>
          ) : (
            <Button size="lg" className="w-full mt-4" onClick={onOpen}>
              {event.isFree ? "Get Tickets" : "Buy Tickets"}
            </Button>
          )
        ) : (
          <Button size="lg" asChild className="w-full mt-4">
            <Link href={`/sign-in?redirect=${pathname}`}>
              Sign In to Buy Tickets
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

function SingleTicketStatus({
  ticket,
}: {
  ticket: EventWithSlugResponseType["ticketDetails"][number];
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium leading-none text-primary">
        {ticket.name}
      </h3>
      {ticket.description && (
        <p className="text-sm text-muted-foreground">{ticket.description}</p>
      )}
    </div>
  );
}
