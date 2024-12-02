"use client";

import { memo, useCallback, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import EventDetails from "./steps/event-details";
import { StepIndicator } from "./step-indicator";
import { EventDateTime } from "./steps/event-date-time";
import { LocationDetailsStep } from "./steps/location-details";
import { TicketDetails } from "./steps/ticket-details";

import { eventFormSchema, type EventFormValues } from "../../zod-schemas";
import { createEvent, updateEvent } from "@/actions/event.action";

import { useUploadThing } from "@/lib/uploadthing";
import { EventByIdResponseType } from "@/lib/db/queries/event.query";

const defaultFormValues: EventFormValues = {
  title: "",
  description: "",
  image: "",
  isFree: false,
  isOnline: false,
  categoryId: "",
  location: "",
  startDateTime: new Date(),
  endDateTime: new Date(),
  tickets: [
    {
      name: "",
      quantity: 1,
      maxPerCustomer: 1,
      price: 0,
    },
  ],
};

const Step_Fields: Record<number, (keyof EventFormValues)[]> = {
  0: ["title", "description", "image", "isFree", "categoryId"],
  1: ["startDateTime", "endDateTime"],
  2: ["location", "isOnline"],
  3: ["tickets"],
} as const;

const Form_Steps = [
  "Event Details",
  "Event Date & Time",
  "Event Location",
  "Ticket Details",
] as const;

type EventCreationFormProps = {
  mode?: "create" | "update";
  event?: EventByIdResponseType;
};

export const EventCreationForm = memo(
  ({ mode = "create", event }: EventCreationFormProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [files, setFiles] = useState<File[]>([]);
    const [isPending, startTransition] = useTransition();
    const { startUpload } = useUploadThing("imageUploader");
    const queryClient = useQueryClient();

    const initialValues: EventFormValues =
      mode === "update" && event
        ? {
            ...event,
            location: event.location ?? "",
            tickets: event.tickets.map((ticket) => ({
              ...ticket,
              price: ticket.price ? parseFloat(ticket.price) : undefined,
              quantity: ticket.totalQuantity ?? 1,
              description: ticket.description ?? "",
            })),
          }
        : defaultFormValues;

    const form = useForm<EventFormValues>({
      resolver: zodResolver(eventFormSchema),
      defaultValues: initialValues,
    });

    const { handleSubmit, trigger, control } = form;

    const stepFields = Step_Fields;

    // Memoize nextStep and prevStep to avoid re-creating on every render
    const nextStep = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();

        // Trigger validation for the current step
        const isStepValid = await trigger(stepFields[currentStep]);

        if (isStepValid) {
          if (currentStep < Form_Steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
          }
        }
      },
      [trigger, stepFields, currentStep]
    );

    // Go to the previous step
    const prevStep = useCallback(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }, []);

    // Render the content of the current step
    const renderStepContent = useMemo(() => {
      switch (currentStep) {
        case 0:
          return <EventDetails control={control} setFiles={setFiles} />;
        case 1:
          return <EventDateTime control={control} />;
        case 2:
          return <LocationDetailsStep control={control} />;
        case 3:
          return (
            <TicketDetails
              control={control}
              getValues={form.getValues}
              mode={mode}
            />
          );
        default:
          return null;
      }
    }, [control, currentStep, form.getValues, mode]);

    // Submit form
    const onSubmit = useCallback(
      (data: EventFormValues) => {
        startTransition(async () => {
          try {
            const imageUrl =
              files.length > 0
                ? ((await startUpload(files))?.[0]?.url ?? data.image)
                : data.image;

            // Simplify event details preparation
            const processedEventDetails = {
              ...data,
              ...(data.isOnline && { location: undefined }),
              ...(data.isFree && {
                tickets: data.tickets.map((ticket) => ({
                  ...ticket,
                  price: undefined,
                })),
              }),
              image: imageUrl,
            };

            if (mode === "create") {
              const res = await createEvent(processedEventDetails);
              if ("error" in res) {
                toast.error(res.error);
              } else if ("success" in res) {
                queryClient.invalidateQueries({ queryKey: ["events"] });
                toast.success(res.success);
                form.reset();
                setCurrentStep(0);
              }
            }

            if (mode === "update" && event) {
              const updatedEventDetails = {
                ...processedEventDetails,
                slug: event.slug,
                tickets: processedEventDetails.tickets.map((ticket) => {
                  const matchingTicket = event.tickets.find(
                    (eventTicket) => eventTicket.id === ticket.id
                  );
                  return {
                    ...ticket,
                    availableQuantity: matchingTicket
                      ? matchingTicket.availableQuantity
                      : ticket.quantity,
                  };
                }),
              };

              const res = await updateEvent(updatedEventDetails, event.id);

              if ("error" in res) {
                toast.error(res.error);
              } else if ("success" in res) {
                queryClient.invalidateQueries({ queryKey: ["events"] });
                toast.success(res.success);
                setCurrentStep(0);
              }
            }
          } catch (_error) {
            toast.error("An unexpected error occurred");
          }
        });
      },
      [files, form, mode, queryClient, startUpload, event]
    );
    return (
      <div className="w-full max-w-3xl mx-auto space-y-8">
        <h2 className="text-2xl font-semibold md:text-3xl">
          {mode === "create" ? "Create Event" : "Update Event"}
        </h2>

        <StepIndicator currentStep={currentStep} steps={Form_Steps} />
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div>{renderStepContent}</div>

                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={prevStep}
                    disabled={isPending || currentStep === 0}
                  >
                    Previous
                  </Button>

                  {currentStep === Form_Steps.length - 1 ? (
                    <Button type="submit" disabled={isPending}>
                      {isPending && <Loader2Icon className="animate-spin" />}
                      {mode === "create" ? "Create Event" : "Update Event"}
                    </Button>
                  ) : (
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }
);

EventCreationForm.displayName = "EventCreationForm";
