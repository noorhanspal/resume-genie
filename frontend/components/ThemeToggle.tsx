"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="glass-button rounded-full w-11 h-11 transition-all hover:scale-110 active:rotate-45"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
      ) : (
        <Moon className="h-5 w-5 text-blue-900 fill-blue-900 dark:text-blue-200 dark:fill-blue-200 drop-shadow-[0_0_8px_rgba(30,58,138,0.3)]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
