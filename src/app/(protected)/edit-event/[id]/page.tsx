import { redirect } from "next/navigation";

import { EventCreationForm } from "../../components/event-form/event-creation-form";
import Container from "@/components/layout/container";

import { getEventById } from "@/lib/db/queries/event.query";

import { getSession } from "@/utils/get-session";

type EditEventPageProps = {
  params: Promise<{ id: string }>;
};

const EditEvent = async ({ params }: EditEventPageProps) => {
  const { id } = await params;
  const session = await getSession();

  if (session?.user.role !== "host" && session?.user.role !== "admin")
    redirect("/");

  const event = await getEventById(id);

  if (session?.user.id !== event.organizerId) redirect("/");

  return (
    <Container>
      <EventCreationForm mode="update" event={event} />
    </Container>
  );
};

export default EditEvent;
