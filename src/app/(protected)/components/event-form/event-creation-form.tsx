"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import EventDetails from "./steps/event-details";
import { StepIndicator } from "./step-indicator";
import { EventDateTime } from "./steps/event-date-time";
import { LocationDetailsStep } from "./steps/location-details";
import { TicketDetails } from "./steps/ticket-details";

import { eventFormSchema, type EventFormValues } from "../../zod-schemas";

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

const Form_Steps = [
  "Event Details",
  "Event Date & Time",
  "Event Location",
  "Ticket Details",
] as const;

type EventCreationFormProps = {
  mode?: "create" | "update";
};

export const EventCreationForm = memo(
  ({ mode = "create" }: EventCreationFormProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const initialValues = mode === "create" ? defaultFormValues : {};

    const form = useForm<EventFormValues>({
      resolver: zodResolver(eventFormSchema),
      defaultValues: initialValues,
    });

    const { handleSubmit, trigger, control } = form;

    // Submit form
    const onSubmit = async (data: EventFormValues) => {
      let eventDeatails: EventFormValues = { ...data };

      if (data.isOnline) {
        eventDeatails = {
          ...eventDeatails,
          location: undefined,
        };
      }

      if (data.isFree) {
        eventDeatails = {
          ...eventDeatails,
          tickets: data.tickets.map((ticket) => ({
            ...ticket,
            price: undefined,
          })),
        };
      }

      console.log(eventDeatails);
    };

    const stepFields = useMemo(
      () => ({
        0: ["title", "description", "image", "isFree", "categoryId"],
        1: ["startDateTime", "endDateTime"],
        2: ["location", "isOnline"],
        3: ["tickets"],
      }),
      []
    ) as Record<number, (keyof EventFormValues)[]>;

    // Validate form and go to the next step
    const nextStep = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();

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
          return <EventDetails control={control} />;
        case 1:
          return <EventDateTime control={control} />;
        case 2:
          return <LocationDetailsStep control={control} />;
        case 3:
          return <TicketDetails control={control} getValues={form.getValues} />;
        default:
          return null;
      }
    }, [control, currentStep, form.getValues]);

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
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>

                  {currentStep === Form_Steps.length - 1 ? (
                    <Button type="submit">
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