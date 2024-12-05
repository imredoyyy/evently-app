import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

import { getSession } from "@/utils/get-session";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  return (
    <>
      <Header session={session!} />
      <main className="flex flex-col min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default PublicLayout;
