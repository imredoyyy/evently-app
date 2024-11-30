import { redirect } from "next/navigation";

import { stripe } from "@/lib/stripe";

const getSession = async (sessionId: string) => {
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
  const { session_id } = await searchParams;
  if (!session_id) {
    redirect("/");
  }

  const session = await getSession(session_id);

  if (session?.status === "open") {
    return <div>Payment did not go through</div>;
  }

  if (session?.status === "complete" && session?.payment_status === "paid") {
    return <div>Payment went through</div>;
  }

  return <div>Page</div>;
};

export default Page;
