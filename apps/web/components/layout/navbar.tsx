"use client";

import { useMemo } from "react";
import { Magnetic } from "@/components/effects/magnetic";
import { ScrollLink } from "@/components/shared/scroll-link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NAVITEMS, ROUTES } from "@/lib/constants/navigation";
import { useActiveSection } from "@/lib/hooks/ui/use-active-section";
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
            <Tooltip key={item.name}>
              <Magnetic strength={0.2}>
                <TooltipTrigger asChild>
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
                  </ScrollLink>
                </TooltipTrigger>
              </Magnetic>
              <TooltipContent
                className={cn(
                  "font-medium text-[10px] text-foreground"
                )}
                side="top"
                sideOffset={10}
              >
                {item.name}
              </TooltipContent>
            </Tooltip>
          );
        })}

        <div className="mx-1 h-6 w-px bg-border/50" />

        <ThemeToggle />
      </nav>
    </div>
  );
};
