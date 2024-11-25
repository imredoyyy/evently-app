"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Logo } from "@/assets/Logo";

import type { Session } from "@/types";
import { User_Links } from "@/constants";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session: Session;
}

export function AppSidebar({ session, ...props }: AppSidebarProps) {
  const pathname = usePathname();

  if (!session) {
    return null;
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b">
        <Link href="/organizer/dashboard" className="py-2.5 px-3">
          <Logo className="h-7 w-auto" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto overflow-x-hidden relative">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-y-3">
              {User_Links[session?.user?.role].map((item, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton asChild isActive={item.href === pathname}>
                    <Link
                      href={item.href}
                      aria-current={item.href === pathname ? "page" : undefined}
                    >
                      <item.icon className="size-4 mr-2 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
