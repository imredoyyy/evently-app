import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getCategories } from "@/actions/category.action";

import { EventCreationForm } from "../components/event-form/event-creation-form";
import Container from "@/components/layout/container";

const CreateEventPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <Container>
      {/* HydrationBoundary is a Client Component, so hydration will happen there. */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EventCreationForm />
      </HydrationBoundary>
    </Container>
  );
};

export default CreateEventPage;
