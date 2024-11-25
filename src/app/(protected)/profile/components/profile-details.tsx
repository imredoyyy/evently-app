"use client";

import { useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { updateUser, changeEmail } from "@/actions/user.action";
import type { Session } from "@/types";

export const ProfileDetails = ({ session }: { session: Session }) => {
  const [isChangingName, startChangingName] = useTransition();
  const [isChangingEmail, startChangingEmail] = useTransition();

  const handleUpdateName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    if (name.trim() === "") return;

    startChangingName(async () => {
      await updateUser(formData).then((data) => {
        if (data?.success) {
          toast.success("Name updated successfully");
        }
        if (data?.error) {
          toast.error(data.error);
        }
      });
    });
  };

  const handleUpdateEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    if (email.trim() === "") return;

    startChangingEmail(async () => {
      await changeEmail(formData).then((data) => {
        if (data?.success) {
          toast.success("Email updated successfully");
        }
        if (data?.error) {
          toast.error(data.error);
        }
      });
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-2xl">Profile Details</h2>
      <Separator />
      <div className="flex flex-col gap-4 max-w-screen-sm">
        <div className="relative size-16 rounded-full shadow-sm border mx-auto overflow-hidden">
          <Image
            src={session?.user?.image ?? "/dummy-profile.png"}
            alt={session?.user?.name ?? "avatar"}
            height={64}
            width={64}
            className="object-cover shadow-sm rounded-full"
          />
        </div>
        <form
          onSubmit={handleUpdateName}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              defaultValue={session?.user?.name ?? ""}
            />
          </div>
          <Button type="submit" className="mt-auto">
            {isChangingName && <Loader2Icon className="size-4 animate-spin" />}
            Change Name
          </Button>
        </form>

        <form
          onSubmit={handleUpdateEmail}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              defaultValue={session?.user?.email ?? ""}
            />
          </div>
          <Button type="submit" className="mt-auto">
            {isChangingEmail && <Loader2Icon className="size-4 animate-spin" />}
            Change Email
          </Button>
        </form>
      </div>
    </div>
  );
};
