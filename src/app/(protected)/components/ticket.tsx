"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  DownloadIcon,
  IdCardIcon,
  MapPinIcon,
  TicketIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/shared/spinner";

import { getTicketWithDetails } from "@/lib/db/queries/ticket.query";
import { cn } from "@/lib/utils";
import { formatDateTime, formatPrice } from "@/utils/formatter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const Ticket = ({
  userId,
  ticketId,
}: {
  userId: string;
  ticketId: string;
}) => {
  const {
    data: ticket,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicketWithDetails(ticketId, userId),
  });
  const pathname = usePathname();
  const isTicketPage = pathname === `/tickets/${ticketId}`;

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !ticket) {
    return <p>Error: {error?.message}</p>;
  }

  const isPastEvent = ticket.event.endDate < new Date();

  return (
    <div className="max-w-screen-md mx-auto space-y-6">
      {isTicketPage ? (
        <TicketPageTopHeader ticketTitle={ticket.event.title} />
      ) : (
        <Link
          href="/my-tickets"
          className="text-primary hover:underline underline-offset-4"
        >
          My Tickets
        </Link>
      )}

      <Card id="printable" className="p-0 overflow-hidden rounded-xl w-full">
        <CardContent className="p-4 overflow-hidden space-y-4">
          {/* Header */}
          <div className="relative rounded-md w-full aspect-[18/9] overflow-hidden">
            <Image
              src={ticket.event.image}
              alt={ticket.event.title}
              fill
              priority
              className={cn(
                "object-cover",
                ticket.event.isCancelled && "opacity-40"
              )}
            />
            <div className="absolute inset-0 bg-black/15" />

            <div className={cn("absolute bottom-2 inset-x-2")}>
              <h2 className="font-semibold text-2xl text-white">
                {ticket.event.title}
              </h2>

              {ticket.event.isCancelled && (
                <p className="text-sm text-red-500 mt-1">
                  This event has been cancelled
                </p>
              )}
            </div>
          </div>

          {/* Ticket details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 text-sm">
              <div className="flex items-center">
                <CalendarDaysIcon
                  className={cn(
                    "size-4 shrink-0 mr-2",
                    ticket.event.isCancelled ? "text-red-500" : "text-primary"
                  )}
                />

                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {formatDateTime(ticket.event.startDate).dateTime} -
                  </p>
                  <p className="font-medium">
                    {formatDateTime(ticket.event.endDate).dateTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPinIcon
                  className={cn(
                    "size-4 shrink-0 mr-2",
                    ticket.event.isCancelled ? "text-red-500" : "text-primary"
                  )}
                />

                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {ticket.event.isOnline ? "Online" : ticket.event.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <UserIcon
                  className={cn(
                    "size-4 shrink-0 mr-2",
                    ticket.event.isCancelled ? "text-red-500" : "text-primary"
                  )}
                />

                <div>
                  <p className="text-muted-foreground text-sm">Ticket Holder</p>
                  <p className="font-medium">{ticket.user.name}</p>
                  <p className="font-medium">{ticket.user.email}</p>
                </div>
              </div>

              <div className="flex items-center">
                <IdCardIcon
                  className={cn(
                    "size-4 shrink-0 mr-2",
                    ticket.event.isCancelled ? "text-red-500" : "text-primary"
                  )}
                />

                <div>
                  <p className="text-muted-foreground text-sm">
                    Ticket Holder ID
                  </p>
                  <p className="font-medium">{ticket.user.id}</p>
                </div>
              </div>

              <div className="flex items-center">
                <TicketIcon
                  className={cn(
                    "size-4 shrink-0 mr-2",
                    ticket.event.isCancelled ? "text-red-500" : "text-primary"
                  )}
                />

                <div>
                  <p className="text-muted-foreground">Ticket</p>
                  <p className="font-medium">
                    {ticket.ticketDetails.name + " x" + ticket.quantity}
                  </p>
                  <p className="font-medium">
                    {ticket.event.isFree ? "Free" : formatPrice(ticket.amount!)}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex flex-col pl-6 gap-y-4 items-center justify-center border-l">
              <div className="size-48 p-2 rounded-md md:size-56 bg-white">
                <QRCodeSVG
                  value={[
                    `🎫 Ticket ID: ${ticket.id}`,
                    `🔔 Ticket Status: ${ticket.event.isCancelled ? "Cancelled" : isPastEvent ? "Expired" : ticket.status}`,
                    `📦 Order Status: ${ticket.order.status}`,
                  ].join(" | ")}
                  className="w-full h-full"
                  imageSettings={{
                    src: "/favicon.ico",
                    height: 24,
                    width: 24,
                    excavate: true,
                    opacity: 1,
                  }}
                />
              </div>
              <p className="text-muted-foreground text-sm">
                Ticket ID: {ticket.id}
              </p>
            </div>
          </div>

          {/* Other details */}
          <div className="text-sm space-y-2">
            <h3 className="font-medium">Important Details</h3>
            {ticket.event.isCancelled ? (
              <p className="text-red-500">
                This event has been cancelled. A refund will be processed if it
                hasn&apos;t been already.
              </p>
            ) : (
              <ul className="list-inside list-disc text-muted-foreground">
                <li>Please arrive 30 minutes before the start of the event</li>
                <li>Have your ticket QR code ready for scanning</li>
                <li>This ticket is non-refundable(unless cancelled)</li>
                <li>Ticket is valid until the event ends</li>
              </ul>
            )}
          </div>

          {/* Ticket Footer */}
          <div
            className={cn(
              "p-4 flex justify-between items-center text-sm",
              ticket.event.isCancelled
                ? "bg-red-500/20 rounded-md"
                : "bg-primary-foreground rounded-md"
            )}
          >
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Purchase Date: {formatDateTime(ticket.purchasedAt).dateTime}
            </p>
            <p
              className={cn(
                "font-medium",
                ticket.event.isCancelled ? "text-red-500" : "text-primary"
              )}
            >
              {ticket.event.isCancelled
                ? "Cancelled"
                : isPastEvent
                  ? "Expired"
                  : ticket.status}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TicketPageTopHeader = ({ ticketTitle }: { ticketTitle: string }) => {
  const router = useRouter();
  const downloadTicketPDF = () => {
    const element = document.getElementById("printable") as HTMLDivElement;

    if (!element) {
      return;
    }

    const printWindow = window.open("", "_blank");

    if (printWindow) {
      const stylesheets = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("\n");
          } catch (e) {
            return "";
          }
        })
        .join("\n");

      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>${ticketTitle || "Ticket"}</title>
            <style>
              body {
                font-family: "Arial", sans-serif;
              }
              ${stylesheets}
              @media print {
                body { 
                  margin: 0;
                  padding: 10mm; 
                }
              }
            </style>
          </head>
          <body>
            ${element.outerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();

      // Slight delay before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div
        className="flex items-center gap-2 text-primary hover:underline underline-offset-4 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="size-4" />
        Previous
      </div>

      <Button onClick={downloadTicketPDF}>
        Download PDF <DownloadIcon />
      </Button>
    </div>
  );
};
