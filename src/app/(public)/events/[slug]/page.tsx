import { getEventBySlug } from "@/actions/event.action";
import { SingleEventDetails } from "../../components/single-event-details";
import Container from "@/components/layout/container";

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
    </>
  );
};

export default EventPage;
