import { Suspense } from "react";
import { redirect } from "next/navigation";

import Container from "@/components/layout/container";
import { AuthForm } from "@/app/(auth)/components/AuthForm";

import { getSession } from "@/utils/get-session";

const SignInPage = async () => {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <Container>
      <Suspense fallback={null}>
        <AuthForm />
      </Suspense>
    </Container>
  );
};

export default SignInPage;
