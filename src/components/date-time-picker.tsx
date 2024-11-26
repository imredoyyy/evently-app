"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from "lucide-react";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";
import { setHours, setMinutes } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DateTimePickerProps = {
  date: Date;
  setDate: (date: Date) => void;
} & Omit<
  React.ComponentProps<typeof DayPicker>,
  "selected" | "onSelect" | "mode"
>;

function DateTimePicker({
  date,
  setDate,
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: DateTimePickerProps) {
  const hours = Array.from({ length: 12 }, (_, hour) => hour + 1);
  const minutes = Array.from({ length: 60 }, (_, minute) => minute);

  // Convert 24h to 12h format
  const get12Hour = (hour24: number) => {
    if (hour24 === 0) return 12;
    if (hour24 > 12) return hour24 - 12;
    return hour24;
  };

  // Get period (AM/PM)
  const getPeriod = (hour24: number) => (hour24 >= 12 ? "PM" : "AM");

  // Convert 12h to 24h format
  const get24Hour = (hour12: number, period: string) => {
    if (hour12 === 12) {
      return period === "AM" ? 0 : 12;
    }
    return period === "AM" ? hour12 : hour12 + 12;
  };

  const handleSelect: SelectSingleEventHandler = (selected) => {
    if (selected) {
      const newDate = new Date(selected);
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
      setDate(newDate);
    }
  };

  return (
    <div className="space-y-4">
      <DayPicker
        mode="single"
        selected={date}
        onSelect={handleSelect}
        showOutsideDays={showOutsideDays}
        className={cn("p-2", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "size-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "size-9 p-0 font-normal aria-selected:opacity-100"
          ),
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_hidden: "invisible",

          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => (
            <ChevronLeftIcon className="size-4" {...props} />
          ),
          IconRight: ({ ...props }) => (
            <ChevronRightIcon className="size-4" {...props} />
          ),
        }}
        {...props}
      />
      <div className="flex py-3 px-2 border-t items-center gap-2">
        <ClockIcon className="size-4" />
        <Select
          value={get12Hour(date.getHours()).toString()}
          onValueChange={(value) => {
            const newHour = get24Hour(
              parseInt(value),
              getPeriod(date.getHours())
            );
            setDate(setHours(date, newHour));
          }}
        >
          <SelectTrigger className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour.toString()}>
                {hour.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>:</span>
        <Select
          value={date.getMinutes().toString()}
          onValueChange={(value) => {
            setDate(setMinutes(date, parseInt(value)));
          }}
        >
          <SelectTrigger className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((minute) => (
              <SelectItem key={minute} value={minute.toString()}>
                {minute.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={getPeriod(date.getHours())}
          onValueChange={(period) => {
            const currentHour12 = get12Hour(date.getHours());
            const newHour24 = get24Hour(currentHour12, period);
            setDate(setHours(date, newHour24));
          }}
        >
          <SelectTrigger className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

DateTimePicker.displayName = "DateTimePicker";

export { DateTimePicker };
