import Container from "@/components/layout/container";
import { AuthForm } from "@/app/(auth)/components/AuthForm";

const SignUpPage = () => {
  return (
    <Container>
      <AuthForm mode="sign-up" />
    </Container>
  );
};

export default SignUpPage;
