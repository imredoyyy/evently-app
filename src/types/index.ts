import type { auth } from "@/lib/auth";
import { LucideIcon } from "lucide-react";

export type Session = typeof auth.$Infer.Session;

export type UserLinkType = {
  label: string;
  href: string;
  icon: LucideIcon;
};
