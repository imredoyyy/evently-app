import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

import Container from "@/components/layout/container";
import { Spinner } from "@/components/shared/spinner";

// Dynamic import
const EventsTable = dynamic(
  () =>
    import("@/app/(protected)/components/shared/events-table").then(
      (mod) => mod.EventsTable
    ),
  {
    loading: () => <Spinner />,
  }
);

import { getSession } from "@/utils/get-session";

const Page = async () => {
  const session = await getSession();

  if (session?.user.role !== "host") redirect("/");

  return (
    <Container>
      <EventsTable userId={session!.user.id} />
    </Container>
  );
};

export default Page;
