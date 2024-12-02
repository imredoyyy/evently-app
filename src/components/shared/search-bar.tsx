"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";

import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";

export const SearchBar = () => {
  const router = useRouter();

  const onSearch = (form: FormData) => {
    const query = form.get("query") as string;

    if (query.trim() === "") return;

    router.push(`/events?query=${query}`);
  };

  return (
    <Form
      action={onSearch}
      className="hidden lg:flex bg-background items-center w-full overflow-hidden focus-within:ring-primary rounded-md border px-4 py-0.5 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-[3px] focus-within:ring-offset-background transition-all duration-200 xl:max-w-[360px] lg:max-w-[300px] relative"
    >
      <Input
        name="query"
        type="text"
        placeholder="Search events..."
        className="pl-8 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-transparent border-0"
      />
      <SearchIcon
        className="absolute shrink-0 left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
        aria-hidden="true"
      />
    </Form>
  );
};
