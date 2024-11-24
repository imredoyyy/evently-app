"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/assets/Logo";

import { cn } from "@/lib/utils";
import { Nav_Links } from "@/constants";
import useWindowSize from "@/hooks/use-window-size";
import useToggleState from "@/hooks/useToggleState";
import { Session } from "@/types";

const MobileMenu = ({ session }: { session: Session }) => {
  const [open, toggleOpen] = useToggleState(false);
  const pathname = usePathname();
  const { width } = useWindowSize();

  const handleCloseMenu = () => {
    if (open) {
      toggleOpen();
    }
  };

  useEffect(() => {
    if (width && width >= 1024 && open) {
      toggleOpen();
    }
  }, [width, open, toggleOpen]);

  return (
    <Sheet open={open} onOpenChange={toggleOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon" className={cn("size-8 p-0")}>
          <span className="sr-only">Open Menu</span>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 sm:max-w-[350px]">
        <SheetHeader>
          <SheetTitle className="sr-only">Menu</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <Logo className="h-7 w-auto" />
        </div>
        <Separator />
        <ul className="flex flex-col gap-y-4 p-4">
          {Nav_Links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={cn(
                  "font-medium leading-none text-muted-foreground transition-colors active:text-primary",
                  pathname === link.href && "text-primary"
                )}
                onClick={() => setTimeout(() => handleCloseMenu(), 300)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="space-y-4 p-4">
          {!session && (
            <Button asChild>
              <Link
                href="/sign-in"
                className="w-full"
                onClick={() => setTimeout(() => handleCloseMenu(), 300)}
              >
                Sign In
              </Link>
            </Button>
          )}

          <Button variant="outline" asChild>
            <Link
              href="/host-sign-up"
              className="w-full"
              onClick={() => setTimeout(() => handleCloseMenu(), 300)}
            >
              Join as Host
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
