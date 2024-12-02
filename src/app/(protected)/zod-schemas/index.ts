import { z } from "zod";

import { isValidImageUrl } from "@/lib/utils";

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
});

export const eventFormSchema = z
  .object({
    // Step 1: Event Details
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(255, "Title must be at most 255 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    image: z
      .string({ required_error: "Image is required" })
      .refine(isValidImageUrl, {
        message: "Invalid image URL",
      }),
    isFree: z.boolean().default(false),
    categoryId: z.string({ required_error: "Please select a category" }),

    // Step 2: Event Date & Time
    startDateTime: z
      .date({
        required_error: "Start date is required",
      })
      .refine((date) => date instanceof Date, {
        message: "Start date must be a valid date",
      }),
    endDateTime: z
      .date({
        required_error: "End date is required",
      })
      .refine((date) => date instanceof Date, {
        message: "End date must be a valid date",
      }),

    // Step 3: Event Location
    location: z.string().nullable().optional(),
    isOnline: z.boolean().default(false),

    // Step 4: Ticket Details
    tickets: z
      .array(
        z.object({
          id: z.string().uuid().optional(),
          name: z.string().min(1, "Ticket name is required"),
          description: z.string().nullable().optional(),
          price: z.coerce
            .number()
            .min(0, "Price must be a non-negative number")

            .optional(),
          quantity: z.coerce
            .number()
            .int()
            .min(1, "Quantity must be at least 1"),
          maxPerCustomer: z.coerce
            .number()
            .int()
            .min(1, "Max per customer must be at least 1")
            .default(1),
        })
      )
      .min(1, "At least one ticket type is required"),
  })
  .superRefine((data, ctx) => {
    if (data.startDateTime && data.endDateTime) {
      if (data.endDateTime <= data.startDateTime) {
        ctx.addIssue({
          code: "custom",
          path: ["endDateTime"],
          message: "End date must be after start date",
        });
      }
    }

    if (!data.isFree) {
      data.tickets.forEach((ticket, i) => {
        if (!ticket.price || ticket.price <= 0) {
          ctx.addIssue({
            code: "custom",
            path: ["tickets", i, "price"],
            message: "Tickets for paid events must have a price",
          });
        }
      });
    }

    data.tickets.forEach((ticket, i) => {
      if (ticket.quantity < ticket.maxPerCustomer) {
        ctx.addIssue({
          code: "custom",
          path: ["tickets", i, "quantity"],
          message: "Quantity must be greater than or equal to max per customer",
        });
      }
    });

    if (!data.isOnline) {
      if (!data.location?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["location"],
          message: "Location is required for offline events",
        });
      }
    }
  });

export type EventFormValues = z.infer<typeof eventFormSchema>;
