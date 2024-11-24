import { UserButtonLinkType } from "@/types";
import {
  User2Icon,
  SettingsIcon,
  CalendarCheckIcon,
  TicketCheckIcon,
  Users2Icon,
} from "lucide-react";

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

const User_Button_Links: Record<string, UserButtonLinkType[]> = {
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
      label: "My Events",
      href: "/organizer/my-events",
      icon: CalendarCheckIcon,
    },
    {
      label: "My Tickets",
      href: "/organizer/my-tickets",
      icon: TicketCheckIcon,
    },
  ],
  admin: [
    ...Common_User_ButtonLinks,
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

export { Nav_Links, User_Button_Links };
