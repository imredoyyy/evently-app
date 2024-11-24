"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/assets/Logo";
import MobileMenu from "@/components/layout/mobile-menu";
import { UserButton } from "@/components/user-button";

import { Nav_Links } from "@/constants";
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import type { Session } from "@/types";

const Header = ({ session }: { session: Session }) => {
  const scrolled = useScroll(40);
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent bg-background shadow-sm transition-all",
        scrolled && "border-muted-foreground/20 bg-muted/30 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4 md:px-8">
        <Link href="/">
          <Logo className="h-7 w-auto lg:h-8" />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <ul className="flex items-center gap-4">
            {Nav_Links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={cn(
                    "font-medium transition-colors",
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/host-sign-up">Join as Host</Link>
            </Button>
            {session ? (
              <UserButton session={session} />
            ) : (
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 lg:hidden">
          <UserButton session={session} />
          <MobileMenu session={session} />
        </div>
      </div>
    </header>
  );
};

export default Header;
