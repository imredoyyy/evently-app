import Container from "@/components/layout/container";
import { ProfileDetails } from "./components/profile-details";
import { getSession } from "@/utils/get-session";

const Page = async () => {
  const session = await getSession();

  return (
    <Container>
      <ProfileDetails session={session!} />
    </Container>
  );
};

export default Page;
