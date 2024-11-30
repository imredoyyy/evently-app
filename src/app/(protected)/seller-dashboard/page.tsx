import { redirect } from "next/navigation";

import { getSession } from "@/utils/get-session";

const HostPage = async () => {
  const session = await getSession();

  if (session?.user.role !== "host") redirect("/");

  return <></>;
};

export default HostPage;
