import { memo } from "react";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/date-time-picker";

import { EventFormValues } from "@/app/(protected)/zod-schemas";
import { cn } from "@/lib/utils";

interface EventDateTimeProps {
  control: Control<EventFormValues>;
}

export const EventDateTime = memo(({ control }: EventDateTimeProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 mt-10">
      <FormField
        control={control}
        name="startDateTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex flex-col">Start Date & Time</FormLabel>
            <Popover>
              <PopoverTrigger asChild className="w-full">
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP p")
                    ) : (
                      <span>Pick start date</span>
                    )}
                    <CalendarIcon className="ml-auto opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DateTimePicker
                  date={field.value}
                  setDate={field.onChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="endDateTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex flex-col">End Date & Time</FormLabel>
            <Popover>
              <PopoverTrigger asChild className="w-full">
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP p")
                    ) : (
                      <span>Pick end date</span>
                    )}
                    <CalendarIcon className="ml-auto opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DateTimePicker
                  date={field.value}
                  setDate={field.onChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
});

EventDateTime.displayName = "EventDateTime";
