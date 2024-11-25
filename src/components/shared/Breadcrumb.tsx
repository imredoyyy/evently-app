"use client";

import React from "react";
import { usePathname } from "next/navigation";

import {
  Breadcrumb as BreadcrumbPrimitive,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { cn } from "@/lib/utils";

const Breadcrumb = () => {
  const pathname = usePathname();

  const links = pathname.split("/").filter(Boolean);

  return (
    <BreadcrumbPrimitive>
      <BreadcrumbList className="sm:gap-2">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <BreadcrumbPage className="text-muted-foreground transition-colors duration-200 hover:text-primary text-xs md:text-sm">
              Home
            </BreadcrumbPage>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {links.length > 0 && <BreadcrumbSeparator />}

        {links.map((link, i) => {
          const href = `/${links.slice(0, i + 1).join("/")}`;
          const isCurrentPage = i === links.length - 1;
          const formattedLink = link.replace(/-/g, " ");
          return (
            <React.Fragment key={i}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={href}
                  aria-current={isCurrentPage ? "page" : undefined}
                >
                  <BreadcrumbPage
                    className={cn(
                      "text-xs capitalize md:text-sm",
                      isCurrentPage
                        ? "text-primary"
                        : "text-muted-foreground transition-colors duration-200 hover:text-primary"
                    )}
                  >
                    {formattedLink}
                  </BreadcrumbPage>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {i < links.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbPrimitive>
  );
};

export default Breadcrumb;
