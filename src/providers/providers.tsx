"use client";

import { ThemeProvider } from "next-themes";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
  DefaultOptions,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryConfig } from "@/config/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      ...queryConfig,
    } satisfies DefaultOptions,
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

const Providers = ({
  children,
  ...props
}: React.ComponentProps<typeof ThemeProvider>) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      <ThemeProvider {...props}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

export default Providers;
