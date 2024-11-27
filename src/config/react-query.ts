import { DefaultOptions } from "@tanstack/react-query";

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
    // When using hydration approach, we don't want to refetch on mount and on reconnect
    // so that the query is not refetched when the client is hydrated
    refetchOnMount: false,
    refetchOnReconnect: false,
  },
} satisfies DefaultOptions;
