import { Suspense } from "react";
import { redirect } from "next/navigation";

import { AuthForm } from "../components/AuthForm";
import Container from "@/components/layout/container";

import { getSession } from "@/utils/get-session";

const Page = async () => {
  const session = await getSession();

  if (session?.user.role === "host") {
    redirect("/");
  }

  return (
    <>
      {session && session.user.role !== "host" && (
        <div className="absolute inset-0 overflow-hidden backdrop-blur-sm bg-background/5 z-50">
          <div className="w-full h-full flex items-center justify-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-center max-w-md">
              To join as Host, you must sign out from your user account first.
            </h2>
          </div>
        </div>
      )}

      <Container>
        <Suspense fallback={null}>
          <AuthForm mode="sign-up" />
        </Suspense>
      </Container>
    </>
  );
};

export default Page;
