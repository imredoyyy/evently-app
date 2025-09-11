import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import Container from "@/components/layout/container";
import { getEventBySlug, getEvents } from "@/lib/db/queries/event.query";
import { SimilarEvents } from "../../components/similar-events";
import { SingleEventDetails } from "../../components/single-event-details";

const getEvent = cache(async (slug: string) => {
	try {
		const event = await getEventBySlug(slug);

		if (!event) return null;

		return event;
	} catch (_err) {
		return null;
	}
});

export async function generateMetadata({
	params,
}: EventPageProps): Promise<Metadata> {
	const { slug } = await params;
	const event = await getEvent(slug);

	if (!event) return {};

	return {
		title: event.title,
		description: event.description,
		openGraph: {
			images: [event.image],
		},
		twitter: {
			card: "summary_large_image",
			title: event.title,
			description: event.description,
			images: [event.image],
		},
		category: event.categoryName,
	};
}

export async function generateStaticParams() {
	try {
		const events = await getEvents();

		if (!events || events.length === 0) return [];

		return events.map((event) => ({ slug: event.slug }));
	} catch (_error) {
		return [];
	}
}

type EventPageProps = {
	params: Promise<{ slug: string }>;
};

const EventPage = async ({ params }: EventPageProps) => {
	const { slug } = await params;
	const event = await getEvent(slug);

	if (!event) return notFound();

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
