import { UserLinkType } from "@/types";
import {
  User2Icon,
  SettingsIcon,
  CalendarCheckIcon,
  TicketCheckIcon,
  Users2Icon,
  CalendarPlusIcon,
  BanknoteIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  PhoneIcon,
  MapPinIcon,
  MailIcon,
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
    {
      label: "My Earnings",
      href: "/host/my-earnings",
      icon: BanknoteIcon,
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
    {
      label: "All Bookings",
      href: "/admin/all-bookings",
      icon: TicketCheckIcon,
    },
    {
      label: "All Earnings",
      href: "/admin/all-earnings",
      icon: BanknoteIcon,
    },
  ],
};

const TICKET_STATUS: Record<string, TicketType["status"]> = {
  VALID: "valid",
  USED: "used",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
} as const;

const Social_Links = [
  {
    label: "Facebook",
    href: "#",
    icon: FacebookIcon,
  },
  {
    label: "Instagram",
    href: "#",
    icon: InstagramIcon,
  },
  {
    label: "Twitter",
    href: "#",
    icon: TwitterIcon,
  },
  {
    label: "Linkedin",
    href: "#",
    icon: LinkedinIcon,
  },
];

const Quick_Links = [
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Sign In",
    href: "/sign-in",
  },
  {
    label: "Join as a Host",
    href: "/host-sign-up",
  },
];

const Useful_Links = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms & Conditions",
    href: "/terms",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const Footer_Contact_Info = [
  {
    icon: PhoneIcon,
    label: "+1 (123) 456-7890",
    href: "tel:+11234567890",
  },
  {
    icon: MapPinIcon,
    label: "123 Main Street, City, State",
  },
  {
    icon: MailIcon,
    label: "example@domain.com",
    href: "mailto:example@domain.com",
  },
];

export {
  Nav_Links,
  User_Links,
  TICKET_STATUS,
  Social_Links,
  Quick_Links,
  Useful_Links,
  Footer_Contact_Info,
};
