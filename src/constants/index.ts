import { UserLinkType } from "@/types";
import {
  User2Icon,
  SettingsIcon,
  CalendarCheckIcon,
  TicketCheckIcon,
  Users2Icon,
  CalendarPlusIcon,
} from "lucide-react";

import { TicketType } from "@/lib/db/schema";

const Nav_Links = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "About",
    href: "/about",
  },
];

const Common_User_ButtonLinks = [
  {
    label: "Profile",
    href: "/profile",
    icon: User2Icon,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
  },
];

const User_Links: Record<string, UserLinkType[]> = {
  user: [
    ...Common_User_ButtonLinks,
    {
      label: "My Tickets",
      href: "/my-tickets",
      icon: TicketCheckIcon,
    },
  ],
  host: [
    ...Common_User_ButtonLinks,
    {
      label: "Create Event",
      href: "/create-event",
      icon: CalendarPlusIcon,
    },
    {
      label: "My Events",
      href: "/host/my-events",
      icon: CalendarCheckIcon,
    },
    {
      label: "My Bookings",
      href: "/host/my-bookings",
      icon: TicketCheckIcon,
    },
  ],
  admin: [
    ...Common_User_ButtonLinks,
    {
      label: "Create Event",
      href: "/create-event",
      icon: CalendarPlusIcon,
    },
    {
      label: "All Events",
      href: "/admin/all-events",
      icon: CalendarCheckIcon,
    },
    {
      label: "All Users",
      href: "/admin/all-users",
      icon: Users2Icon,
    },
  ],
};

const TICKET_STATUS: Record<string, TicketType["status"]> = {
  VALID: "valid",
  USED: "used",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
} as const;

export { Nav_Links, User_Links, TICKET_STATUS };
