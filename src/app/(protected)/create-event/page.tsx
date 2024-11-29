import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { EventCreationForm } from "../components/event-form/event-creation-form";
import Container from "@/components/layout/container";

import { getCategories } from "@/lib/db/queries/category.query";
import { getSession } from "@/utils/get-session";

const CreateEventPage = async () => {
  const session = await getSession();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (session?.user.role !== "host" && session?.user.role !== "admin")
    redirect("/");

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
