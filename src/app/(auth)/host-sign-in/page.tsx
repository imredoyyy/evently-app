import { Suspense } from "react";

import { AuthForm } from "../components/AuthForm";
import Container from "@/components/layout/container";

const Page = () => {
  return (
    <Container>
      <Suspense fallback={null}>
        <AuthForm />
      </Suspense>
    </Container>
  );
};

export default Page;
