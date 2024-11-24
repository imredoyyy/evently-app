import { Suspense } from "react";

import Container from "@/components/layout/container";
import { AuthForm } from "@/app/(auth)/components/AuthForm";

const SignUpPage = () => {
  return (
    <Container>
      <Suspense fallback={null}>
        <AuthForm mode="sign-up" />
      </Suspense>
    </Container>
  );
};

export default SignUpPage;
