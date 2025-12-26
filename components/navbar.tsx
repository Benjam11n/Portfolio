"use client";

import { Briefcase, FolderOpen, Home, Mail, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "Projects", href: "#projects", icon: FolderOpen },
  { name: "Contact", href: "#contact", icon: Mail },
];

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <nav className="flex items-center gap-1 rounded-2xl border border-border/50 bg-secondary/80 p-2 shadow-xl ring-1 ring-black/5 backdrop-blur-lg">
        {navItems.map((item) => (
          <Link
            className="group relative flex h-10 w-12 flex-col items-center justify-center rounded-2xl transition-all duration-300 hover:bg-accent"
            href={item.href}
            key={item.name}
          >
            <item.icon className="h-5 w-5 text-muted-foreground transition-colors duration-300 group-hover:text-foreground" />
            <span className="sr-only">{item.name}</span>
            <div className="pointer-events-none absolute -top-8 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              {item.name}
            </div>
          </Link>
        ))}

        <div className="mx-1 h-6 w-px bg-border/50" />

        <button
          aria-label="Toggle theme"
          className="group relative flex h-10 w-12 flex-col items-center justify-center rounded-2xl transition-all duration-300 hover:bg-accent"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          type="button"
        >
          {mounted && theme === "dark" ? (
            <Moon className="h-5 w-5 text-muted-foreground transition-colors duration-300 group-hover:text-foreground" />
          ) : (
            <Sun className="h-5 w-5 text-muted-foreground transition-colors duration-300 group-hover:text-foreground" />
          )}
        </button>
      </nav>
    </div>
  );
};
