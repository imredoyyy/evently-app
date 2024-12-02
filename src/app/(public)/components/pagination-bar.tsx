"use client";

import { memo } from "react";
import { useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { cn } from "@/lib/utils";
import { formUrlQuery } from "@/lib/utils";

type PaginationBarProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const PaginationBar = memo(
  ({ currentPage, totalPages, onPageChange }: PaginationBarProps) => {
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const createPageUrl = (page: number) => {
      return `/events?${formUrlQuery({
        params: searchParams.toString(),
        updates: { page: page.toString() },
      })}`;
    };

    const handlePreviousPage = () => {
      if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNextPage = () => {
      if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const handlePageClick = (page: number) => {
      onPageChange(page);
    };

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createPageUrl(currentPage - 1)}
              onClick={handlePreviousPage}
              className={cn(
                currentPage === 1 && "text-muted-foreground pointer-events-none"
              )}
            >
              Previous
            </PaginationPrevious>
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            const isEdgePage = page === 1 || page === totalPages;
            const isActivePage = page === currentPage;
            const isNearCurrentPage = Math.abs(page - currentPage) <= 2;

            if (!isEdgePage && !isNearCurrentPage) {
              if (i === 1 || i === totalPages - 2) {
                return (
                  <PaginationItem key={page} className="hidden md:block">
                    <PaginationEllipsis className="text-muted-foreground" />
                  </PaginationItem>
                );
              }
              return null;
            }
            return (
              <PaginationItem
                key={page}
                className={cn(
                  "hidden md:block",
                  page === currentPage &&
                    "pointer-events-none text-muted-foreground"
                )}
              >
                <PaginationLink
                  href={createPageUrl(page)}
                  onClick={() => handlePageClick(page)}
                  aria-current={isActivePage ? "page" : undefined}
                  isActive={isActivePage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href={createPageUrl(currentPage + 1)}
              onClick={handleNextPage}
              className={cn(
                currentPage >= totalPages &&
                  "text-muted-foreground pointer-events-none"
              )}
            >
              Next
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }
);

PaginationBar.displayName = "PaginationBar";
