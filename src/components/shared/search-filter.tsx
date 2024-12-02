"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { getCategories } from "@/lib/db/queries/category.query";

import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import type { TimeFilterType } from "@/types";
import useDebounce from "@/hooks/use-debounce";

type ExtendedTimeFilterType = TimeFilterType | "all";

export const SearchFilter = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
      <Suspense fallback={null}>
        <Search />
      </Suspense>

      <Suspense fallback={null}>
        <CategoryFilter />
      </Suspense>

      <Suspense fallback={null}>
        <TimeFilter />
      </Suspense>
    </div>
  );
};

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") ?? "");

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      router.push(
        `/events?${removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        })}`
      );
    } else {
      router.push(
        `/events?${formUrlQuery({
          params: searchParams.toString(),
          updates: { query: debouncedQuery },
        })}`
      );
    }
  }, [debouncedQuery, router, searchParams]);

  return (
    <div className="flex bg-background items-center w-full overflow-hidden focus-within:ring-primary rounded-md border px-4 py-0.5 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-[3px] focus-within:ring-offset-background transition-all duration-200 xl:max-w-[360px] lg:max-w-[300px] relative">
      <Input
        name="query"
        type="text"
        placeholder="Search events..."
        className="pl-8 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-transparent border-0"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <SearchIcon
        className="absolute shrink-0 left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
};

function CategoryFilter() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategory = searchParams.get("category") ?? "";

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      router.push(
        `/events?${removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["category"],
        })}`
      );
    } else {
      router.push(
        `/events?${formUrlQuery({
          params: searchParams.toString(),
          updates: { category },
        })}`
      );
    }
  };

  if (!categories || "error" in categories) {
    return (
      <Select disabled>
        <SelectTrigger className="min-h-12">
          <SelectValue placeholder="No categories found" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select onValueChange={handleCategoryChange} defaultValue={currentCategory}>
      <SelectTrigger className="h-[50px] capitalize">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          <SelectItem value="all">All</SelectItem>
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id}
              className="capitalize"
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function TimeFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPeriod = searchParams.get("period") ?? "";

  const handlePeriodChange = (period: ExtendedTimeFilterType) => {
    if (period === "all") {
      router.push(
        `/events?${removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["period"],
        })}`
      );
    } else {
      router.push(
        `/events?${formUrlQuery({
          params: searchParams.toString(),
          updates: { period },
        })}`
      );
    }
  };

  return (
    <Select onValueChange={handlePeriodChange} defaultValue={currentPeriod}>
      <SelectTrigger className="h-[50px]">
        <SelectValue placeholder="Filter by time" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Time</SelectLabel>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="tomorrow">Tomorrow</SelectItem>
          <SelectItem value="this_week">This Week</SelectItem>
          <SelectItem value="next_week">Next Week</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
