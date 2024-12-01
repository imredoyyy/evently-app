import { SingleEventDetails } from "../../components/single-event-details";
import Container from "@/components/layout/container";
import { SimilarEvents } from "../../components/similar-events";

import { getEventBySlug } from "@/lib/db/queries/event.query";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

const EventPage = async ({ params }: EventPageProps) => {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  return (
    <>
      <Container>
        <SingleEventDetails event={event} />
      </Container>

      <SimilarEvents categoryId={event.categoryId} eventId={event.id} />
    </>
  );
};

export default EventPage;
