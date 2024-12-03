import { redirect } from "next/navigation";

import { getSession } from "@/utils/get-session";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { ProtectedRoutesHeader } from "./components/protected-routes-header";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <main className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <ProtectedRoutesHeader session={session} />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
