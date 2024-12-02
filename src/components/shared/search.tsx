"use client";

import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

export const Search = () => {
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
    <div className="hidden lg:flex bg-background items-center w-full overflow-hidden focus-within:ring-primary rounded-md border px-4 py-0.5 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-[3px] focus-within:ring-offset-background transition-all duration-200 xl:max-w-[360px] lg:max-w-[300px] relative">
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
