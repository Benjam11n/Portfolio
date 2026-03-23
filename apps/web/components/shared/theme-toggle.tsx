"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const { setTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === "system" ? systemTheme : theme;
  const handleThemeToggle = useCallback(() => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  }, [currentTheme, setTheme]);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button className="size-11" size="icon" variant="ghost" />;
  }

  return (
    <Button
      className="group relative size-11 hover:bg-transparent"
      onClick={handleThemeToggle}
      size="icon"
      variant="ghost"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          animate={{ rotate: 0, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
          exit={{ rotate: currentTheme === "light" ? 180 : -180, scale: 0 }}
          initial={{ rotate: currentTheme === "light" ? -180 : 180, scale: 0 }}
          key={currentTheme === "light" ? "sun" : "moon"}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {currentTheme === "light" ? (
            <Sun className="size-4 text-yellow-500 transition-transform group-hover:scale-110" />
          ) : (
            <Moon className="size-4 text-primary transition-transform group-hover:scale-110" />
          )}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
