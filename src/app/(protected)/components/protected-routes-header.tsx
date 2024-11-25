import Breadcrumb from "@/components/shared/Breadcrumb";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@/components/user-button";
import { Session } from "@/types";
import React from "react";

export const ProtectedRoutesHeader = ({ session }: { session: Session }) => {
  return (
    <header className="border-b px-4 shrink-0 flex items-center justify-between h-16">
      <div className="flex items-center gap-2 md:gap-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <Breadcrumb />
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-4" />
        <UserButton session={session} />
      </div>
    </header>
  );
};
