"use client";

import { useState, useTransition } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { createCategory } from "@/actions/category.action";

export const AddNewCategoryForm = () => {
  const [categoryName, setCategoryName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    startTransition(async () => {
      const { error, success } = await createCategory(categoryName.trim());
      if (error) {
        toast.error(error);
        return;
      }
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success(success);
        setIsOpen(false);
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger className="text-sm py-1.5 px-7 font-mono text-left w-full justify-normal hover:bg-secondary rounded-md">
        Add New Category
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add a new category</AlertDialogTitle>
          {/* We have to provide asChild props to avoid hydration error */}
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleSubmit}>
            {isPending && <Loader2Icon className="size-4 animate-spin" />}
            Create
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
