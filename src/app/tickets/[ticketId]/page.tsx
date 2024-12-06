import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

import Container from "@/components/layout/container";

const Ticket = dynamic(() =>
  import("@/app/(protected)/components/ticket").then((mod) => mod.Ticket)
);

import { getSession } from "@/utils/get-session";

type TicketPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketPage = async ({ params }: TicketPageProps) => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { ticketId } = await params;

  return (
    <Container>
      <Ticket ticketId={ticketId} userId={session.user.id} />
    </Container>
  );
};

export default TicketPage;
