import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

import Container from "@/components/layout/container";
import { Spinner } from "@/components/shared/spinner";

// Dynamic import
const BookingsTable = dynamic(
  () =>
    import("@/app/(protected)/components/shared/bookings-table").then(
      (mod) => mod.BookingsTable
    ),
  {
    loading: () => <Spinner />,
  }
);

import { getSession } from "@/utils/get-session";

const Page = async () => {
  const session = await getSession();

  if (session?.user.role !== "admin") redirect("/");

  return (
    <Container>
      <BookingsTable session={session!} />
    </Container>
  );
};

export default Page;
