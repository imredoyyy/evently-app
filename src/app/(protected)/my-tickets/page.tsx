import { redirect } from "next/navigation";

import { getSession } from "@/utils/get-session";
import Container from "@/components/layout/container";
import { MyTicketsTable } from "./components/my-tickets-table";

const Page = async () => {
  const session = await getSession();

  if (!session) redirect("/sign-in");

  return (
    <Container>
      <MyTicketsTable userId={session.user.id} />
    </Container>
  );
};

export default Page;
