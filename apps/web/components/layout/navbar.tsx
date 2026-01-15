"use client";

import { useMemo } from "react";
import { Magnetic } from "@/components/effects/magnetic";
import { ScrollLink } from "@/components/shared/scroll-link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NAVITEMS, ROUTES } from "@/lib/constants/navigation";
import { useActiveSection } from "@/lib/hooks/use-active-section";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const sectionIds = useMemo(
    () =>
      NAVITEMS.map((item) => {
        if (item.href === ROUTES.HOME) {
          return "hero";
        }
        return item.href.replace("#", "");
      }),
    [] // Stable IDs
  );

  const activeSection = useActiveSection(sectionIds);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <nav className="flex items-center gap-1 rounded-xl border border-border/50 bg-secondary/80 p-2 shadow-xl ring-1 ring-black/5 backdrop-blur-lg">
        {NAVITEMS.map((item) => {
          const isHome = item.href === ROUTES.HOME;
          const itemId = isHome ? "hero" : item.href.replace("#", "");
          const isActive = activeSection === itemId;

          return (
            <Magnetic key={item.name} strength={0.2}>
              <ScrollLink
                className={cn(
                  "group relative flex h-10 w-12 flex-col items-center justify-center rounded-xl transition-all duration-300 hover:bg-accent",
                  isActive && "bg-primary/15"
                )}
                href={item.href}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-300 group-hover:text-foreground",
                    isActive ? "text-primary/80" : "text-muted-foreground"
                  )}
                />
                <span className="sr-only">{item.name}</span>
                <div className="pointer-events-none absolute -top-8 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.name}
                </div>
              </ScrollLink>
            </Magnetic>
          );
        })}

        <div className="mx-1 h-6 w-px bg-border/50" />

        <ThemeToggle />
      </nav>
    </div>
  );
};
