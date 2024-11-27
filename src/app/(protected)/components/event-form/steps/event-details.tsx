"use client";

import { memo } from "react";

import { useQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AddNewCategoryForm } from "@/app/(protected)/components/add-new-category-form";
import { FileUploader } from "@/components/shared/file-uploader";

import type { EventFormValues } from "@/app/(protected)/zod-schemas";
import { getCategories } from "@/actions/category.action";

interface EventDetailsStepProps {
  control: Control<EventFormValues>;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const EventDetails = memo(({ control, setFiles }: EventDetailsStepProps) => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter event title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your event"
                {...field}
                className="resize-y"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Image</FormLabel>
            <FormControl>
              <FileUploader
                onFieldChange={field.onChange}
                image={field.value}
                setFiles={setFiles}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories && "error" in categories
                  ? null
                  : categories?.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                        className="capitalize"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                <AddNewCategoryForm />
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="isFree"
        render={({ field }) => (
          <FormItem className="flex mt-auto flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>This is a free event</FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
});

EventDetails.displayName = "EventDetails";

export default EventDetails;
