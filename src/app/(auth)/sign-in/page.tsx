import { Suspense } from "react";

import Container from "@/components/layout/container";
import { AuthForm } from "@/app/(auth)/components/AuthForm";

const SignInPage = () => {
  return (
    <Container>
      <Suspense fallback={null}>
        <AuthForm />
      </Suspense>
    </Container>
  );
};

export default SignInPage;
