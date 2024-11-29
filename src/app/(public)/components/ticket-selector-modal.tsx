"use client";

import { useState } from "react";
import { CalendarClockIcon, MapPinCheckIcon } from "lucide-react";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useTicketSelectorModal } from "@/store/use-modal-store";
import { formatDateTime, formatPrice } from "@/utils/formatter";
import { cn } from "@/lib/utils";

import type { EventWithSlugResponseType } from "@/actions/event.action";
import type { TicketDetailsType } from "@/lib/db/schema";

type Props = {
  event: EventWithSlugResponseType;
};

const TicketSelectorModal = ({ event }: Props) => {
  const [selectedQuantities, setSelectedQuantities] = useState<
    Record<string, number>
  >({});
  const { isOpen, onClose } = useTicketSelectorModal();

  const calculatePrice = (
    ticketDetails: TicketDetailsType,
    quantity: number
  ) => {
    if (event.isFree || !ticketDetails.price) return "0.00";

    return (parseFloat(ticketDetails.price) * (quantity || 0)).toString();
  };

  const calculateTotalPrice = () => {
    const total = event.ticketDetails.reduce((acc, ticket) => {
      const quantity = selectedQuantities[ticket.id] || 0;
      return acc + parseFloat(calculatePrice(ticket, quantity));
    }, 0);
    return total.toString();
  };

  const handleQuantityChange = (ticketId: string, quantity: string) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [ticketId]: quantity === "0" ? 0 : parseInt(quantity),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl leading-none text-center">
            {event.title}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              <div className="flex items-center gap-1">
                <MapPinCheckIcon className="size-4 text-primary shrink-0" />
                <span>{event.isOnline ? "Online" : event.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarClockIcon className="size-4 text-primary shrink-0" />
                <span>{formatDateTime(event.startDateTime).dateTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarClockIcon className="size-4 text-primary shrink-0" />
                <span>{formatDateTime(event.startDateTime).dateTime}</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <h3>Select Ticket Type & Quantity</h3>

          {event.ticketDetails.map((ticket) => (
            <div
              key={ticket.id}
              className="grid items-center grid-cols-3 px-4 py-2 border rounded-lg shadow-sm border-border/60"
            >
              <div className="space-y-2">
                <h4>{ticket.name}</h4>
                {ticket.description && <p>{ticket.description}</p>}
                <p className="text-sm font-medium text-muted-foreground">
                  {ticket.price ? formatPrice(ticket.price) : "Free"}
                </p>
              </div>

              <Select
                key={ticket.id}
                value={selectedQuantities[ticket.id]?.toString()}
                onValueChange={(quantity) =>
                  handleQuantityChange(ticket.id, quantity)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Quantity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0" disabled={event.availability.isSoldout}>
                    0
                  </SelectItem>
                  {Array.from({ length: ticket.maxPerCustomer }).map((_, i) => (
                    <SelectItem
                      key={i}
                      value={(i + 1).toString()}
                      disabled={
                        event.availability.isSoldout ||
                        i + 1 > event.availability.remaningTickets
                      }
                      className={cn(
                        event.availability.remaningTickets < i + 1 &&
                          "text-muted-foreground"
                      )}
                    >
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-right">
                <span className="font-medium text-primary">
                  {formatPrice(
                    calculatePrice(ticket, selectedQuantities[ticket.id])
                  ) || "$0.00"}
                </span>
              </div>
            </div>
          ))}

          {/*  */}
          <div className="px-4 py-2 border rounded-lg shadow-sm border-border/60">
            <div className="flex items-center justify-between">
              <h4>Total Tickets</h4>
              <p className="text-primary">
                {Object.entries(selectedQuantities).reduce(
                  (acc, [_, quantity]) => acc + quantity,
                  0
                )}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <h4>Total Price</h4>
              <p className="text-primary">
                {formatPrice(calculateTotalPrice()) ?? "$0.00"}
              </p>
            </div>
          </div>

          {/* TODO: Add checkout button */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketSelectorModal;
