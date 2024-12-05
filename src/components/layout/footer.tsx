import Link from "next/link";
import { CopyrightIcon } from "lucide-react";

import {
  Footer_Contact_Info,
  Quick_Links,
  Social_Links,
  Useful_Links,
} from "@/constants";
import { Logo } from "@/assets/Logo";

const Footer = () => {
  return (
    <footer className="py-6 md:py-10 w-full bg-primary-foreground">
      <div className="px-4 mx-auto w-full max-w-8xl md:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="flex flex-col gap-4">
            <div>
              <Link href="/">
                <Logo className="h-7 w-auto lg:h-8" />
              </Link>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Find and buy tickets for concerts, sports, theater, and more!
                Enjoy hassle-free booking and secure transactions.
              </p>
            </div>
            <div className="flex gap-2 items-center">
              {Social_Links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center rounded-full transition-colors duration-200 size-8 hover:bg-muted group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  aria-label={`Visit ${link.label} profile`}
                >
                  <link.icon
                    className="transition-colors duration-200 size-4 shrink-0 group-hover:text-primary/80 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold leading-none">Quick Links</h2>

            <ul className="flex flex-col gap-2">
              {Quick_Links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-200 text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold leading-none">Useful Links</h2>

            <ul className="flex flex-col gap-2">
              {Useful_Links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-200 text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold leading-none">Contact Us</h2>

            <ul className="flex flex-col gap-2">
              {Footer_Contact_Info.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <>
                      <Link
                        href={item.href}
                        className="flex gap-2 items-center transition-colors duration-200 text-muted-foreground hover:text-primary"
                      >
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </>
                  ) : (
                    <span className="flex gap-2 items-center transition-colors duration-200 cursor-default text-muted-foreground hover:text-primary">
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Attribution */}
        <div className="flex flex-col mt-6 items-center text-sm border-t pt-6 md:pt-10 border-muted-foreground/30 gap-y-2 text-muted-foreground md:mt-10">
          <p className="flex justify-center items-center">
            <CopyrightIcon className="font-normal shrink-0 size-4" />
            <span className="ml-1">
              {new Date().getFullYear()} Evently. All Rights Reserved.
            </span>
          </p>
          <p>
            Designed and Developed by{" "}
            <Link
              href="https://portfolio.coderredoy.com"
              target="_blank"
              className="transition-colors duration-200 text-primary underline underline-offset-4"
            >
              Coder Redoy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
