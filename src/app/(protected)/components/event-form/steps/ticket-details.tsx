"use client";

import { memo, useState, useTransition } from "react";
import type { Control, UseFormGetValues } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { Trash2Icon, PlusCircleIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

import { EventFormValues } from "@/app/(protected)/zod-schemas";
import { deleteTicket } from "@/actions/ticket-details.action";

interface TicketDetailsStepProps {
  control: Control<EventFormValues>;
  getValues: UseFormGetValues<EventFormValues>;
  mode: "create" | "update";
}

export const TicketDetails = memo(
  ({ control, getValues, mode }: TicketDetailsStepProps) => {
    const [openDialogIdx, setOpenDialogIdx] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();
    const { fields, append, remove } = useFieldArray({
      control,
      name: "tickets",
    });

    const isFree = getValues("isFree");

    const handleAddTicket = () => {
      append({
        name: "",
        description: "",
        quantity: 1,
        maxPerCustomer: 1,
      });
    };

    const handleDeleteTicket = (
      e: React.MouseEvent,
      i: number,
      ticketId?: string
    ) => {
      e.preventDefault();
      if (mode === "update" && ticketId) {
        startTransition(async () => {
          try {
            await deleteTicket(ticketId);
            remove(i);
          } catch (err) {
            console.error("Error deleting ticket", err);
            toast.error(
              err instanceof Error ? err.message : "Failed to delete ticket"
            );
          } finally {
            setOpenDialogIdx(null);
          }
        });
      } else {
        remove(i);
      }
    };

    return (
      <>
        <div className="space-y-4">
          <h2 className="font-semibold text-2xl">Ticket Types</h2>

          {fields.map((field, i) => (
            <div key={field.id} className="flex flex-col gap-y-4 p-4 relative">
              <AlertDialog
                open={openDialogIdx === i}
                onOpenChange={(isOpen) => setOpenDialogIdx(isOpen ? i : null)}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-2"
                  >
                    <Trash2Icon />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this ticket?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the ticket.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                      Cancel
                    </AlertDialogCancel>
                    {/* <AlertDialogAction asChild> */}
                    <Button
                      disabled={isPending}
                      variant="destructive"
                      onClick={(e) =>
                        handleDeleteTicket(e, i, getValues(`tickets.${i}.id`))
                      }
                    >
                      {isPending ? (
                        <Loader2Icon className="animate-spin" />
                      ) : (
                        <Trash2Icon />
                      )}
                      <span>Delete</span>
                    </Button>
                    {/* </AlertDialogAction> */}
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <FormField
                control={control}
                name={`tickets.${i}.id`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="hidden" {...inputField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`tickets.${i}.name`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Ticket Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Front Row" {...inputField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`tickets.${i}.description`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Ticket Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...inputField}
                        value={inputField.value ?? ""}
                        placeholder="Additional ticket details"
                        className="resize-y"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`tickets.${i}.price`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Ticket Price</FormLabel>
                    <FormControl>
                      <Input
                        {...inputField}
                        type="number"
                        placeholder="e.g. 25.99"
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          inputField.onChange(isNaN(value) ? undefined : value);
                        }}
                        disabled={isFree}
                      />
                    </FormControl>
                    {isFree && (
                      <FormDescription>
                        You have selected this event to be free
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`tickets.${i}.quantity`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          {...inputField}
                          type="number"
                          placeholder="e.g. 100"
                          onChange={inputField.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`tickets.${i}.maxPerCustomer`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>Max Per Customer</FormLabel>
                      <FormControl>
                        <Input
                          {...inputField}
                          type="number"
                          placeholder="e.g. 3"
                          onChange={inputField.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {i !== fields.length - 1 && (
                <Separator className="mt-6 bg-primary/40" />
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpenDialogIdx(null);
              handleAddTicket();
            }}
            className="w-full"
          >
            <PlusCircleIcon /> Add Ticket Type
          </Button>
        </div>
      </>
    );
  }
);

TicketDetails.displayName = "TicketDetails";
