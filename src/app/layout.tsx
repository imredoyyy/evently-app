import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";

import "./globals.css";

import Site_Config from "@/config/site-config";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <main className="flex min-h-screen flex-col">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
