import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

import Container from "@/components/layout/container";
import { Spinner } from "@/components/shared/spinner";
const EarningsTable = dynamic(
  () =>
    import("@/app/(protected)/components/shared/earnings-table").then(
      (mod) => mod.EarningsTable
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
      <EarningsTable userId={session!.user.id} />
    </Container>
  );
};

export default Page;
