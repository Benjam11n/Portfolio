"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const { setTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button className="size-9" size="icon" variant="ghost" />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <Button
      className="group relative size-9 hover:bg-transparent"
      onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
      size="icon"
      variant="ghost"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          animate={{ scale: 1, rotate: 0 }}
          className="absolute inset-0 flex items-center justify-center"
          exit={{ scale: 0, rotate: currentTheme === "light" ? 180 : -180 }}
          initial={{ scale: 0, rotate: currentTheme === "light" ? -180 : 180 }}
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
