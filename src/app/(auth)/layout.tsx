import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (session) {
    redirect("/");
  }

  return <main className="flex flex-col min-h-screen">{children}</main>;
};

export default AuthLayout;
