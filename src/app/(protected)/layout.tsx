import { redirect } from "next/navigation";

import { getSession } from "@/utils/get-session";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return <main className="flex flex-col min-h-screen">{children}</main>;
};

export default ProtectedLayout;
