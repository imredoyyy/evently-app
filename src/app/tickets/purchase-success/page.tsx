import { redirect } from "next/navigation";

import { stripe } from "@/lib/stripe";

import Container from "@/components/layout/container";
import { Ticket } from "@/app/(protected)/components/ticket";

import { getUserTickets } from "@/lib/db/queries/ticket.query";
import { getSession } from "@/utils/get-session";

const getStripeSession = async (sessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error("Failed to retrieve Stripe session:", error);
    return null;
  }
};

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) => {
  const { session_id: stripeSessionId } = await searchParams;
  const session = await getSession();

  if (!stripeSessionId) {
    redirect("/");
  }

  if (!session) {
    redirect("/sign-in");
  }

  const stripeSession = await getStripeSession(stripeSessionId);
  const userTickets = await getUserTickets(session.user.id);
  const latestTickt = userTickets[userTickets.length - 1];

  if (!latestTickt) {
    redirect("/");
  }

  if (stripeSession?.status === "open") {
    return (
      <Container>
        <div className="w-full max-w-screen-md mx-auto min-h-screen flex items-center justify-center">
          <h2>Your payment didn&apos;t go through.</h2>
        </div>
      </Container>
    );
  }

  if (
    stripeSession?.status === "complete" &&
    stripeSession?.payment_status === "paid"
  ) {
    return (
      <Container>
        <div className="w-full max-w-screen-md mx-auto">
          <div className="space-y-10">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-semibold">
                Ticket Purchase Successfull
              </h2>
              <p className="text-muted-foreground">
                Your ticket has been confirmed and is ready to use
              </p>
            </div>

            <Ticket ticketId={latestTickt.id} />
          </div>
        </div>
      </Container>
    );
  }
};

export default Page;
