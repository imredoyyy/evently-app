import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { Hero } from "@/app/(public)/components/sections/hero";
import { UpcomingEvents } from "@/app/(public)/components/upcoming-events";

import { getEventsByComplexQuery } from "@/actions/event.action";

const Home = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["events"],
    queryFn: () => getEventsByComplexQuery({ pageSize: 8 }),
  });

  return (
    <>
      <Hero />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UpcomingEvents />
      </HydrationBoundary>
    </>
  );
};

export default Home;
