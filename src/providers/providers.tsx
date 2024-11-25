"use client";

import { ThemeProvider } from "next-themes";

const Providers = ({
  children,
  ...props
}: React.ComponentProps<typeof ThemeProvider>) => {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
};

export default Providers;
