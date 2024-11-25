"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonStarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const ThemeSwitcher = ({ className, ...props }: ThemeSwitcherProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  // Prevent hydration error
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={cn(className)} {...props}>
        <SunIcon />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
      className={cn(className)}
      {...props}
    >
      {theme === "light" ? <MoonStarIcon /> : <SunIcon />}
    </Button>
  );
};
