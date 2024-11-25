import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";

import "./globals.css";

import Site_Config from "@/config/site-config";
import Header from "@/components/layout/header";
import { getSession } from "@/utils/get-session";
import Providers from "@/providers/providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: Site_Config.defaultTitle,
    template: `%s | ${Site_Config.title}`,
  },
  description: Site_Config.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <Providers
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Header session={session!} />
          <main className="flex min-h-screen flex-col">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
