"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

import { createStripeCheckoutSession } from "@/actions/payment.action";
import { Button } from "@/components/ui/button";
import { OrderItem } from "@/types";
import { EventWithSlugResponseType } from "@/lib/db/queries/event.query";
import { useSession } from "@/lib/auth-client";

type CheckoutButtonProps = {
  orderItems: OrderItem[];
  event: EventWithSlugResponseType;
};

export const CheckoutButton = ({ orderItems, event }: CheckoutButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const { data } = useSession();

  const handleCreateCheckoutSession = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data?.user) {
      toast.error("You must be logged in to checkout");
      return;
    }
    if (data.user.id === event.organizerId) {
      toast.error("You cannot buy your own ticket");
      return;
    }

    if (orderItems.length === 0) {
      toast.error("Please select at least one ticket");
      return;
    }
    try {
      startTransition(async () => {
        await createStripeCheckoutSession({ event, orderItems });
      });
    } catch (err) {
      console.error(err);

      toast.error(
        err instanceof Error ? err.message : "Failed to create checkout session"
      );
    }
  };

  return (
    <form
      onClick={handleCreateCheckoutSession}
      className="flex items-center justify-center w-full"
    >
      <Button type="submit" role="link" className="w-full" disabled={isPending}>
        {isPending && <Loader2Icon className="animate-spin" />}
        Proceed to Checkout
      </Button>
    </form>
  );
};
