"use client";

import { memo, useState } from "react";

import type { Control } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { EventFormValues } from "@/app/(protected)/zod-schemas";

interface LocationDetailsStepProps {
  control: Control<EventFormValues>;
}

export const LocationDetailsStep = memo(
  ({ control }: LocationDetailsStepProps) => {
    const [isOnline, setIsOnline] = useState(false);

    return (
      <div>
        <FormField
          control={control}
          name="isOnline"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    const boolValue =
                      checked === "indeterminate" ? false : checked;
                    field.onChange(boolValue);
                    setIsOnline(boolValue);
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>This is an online event</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter event location"
                  disabled={isOnline}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }
);

LocationDetailsStep.displayName = "LocationDetailsStep";
