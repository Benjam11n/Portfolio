"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type SectionCardProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  title?: string;
};

export const SectionCard = forwardRef<HTMLElement, SectionCardProps>(
  ({ children, title, className, ...props }, ref) => {
    return (
      <section
        className={cn(
          "scroll-mt-24 rounded-3xl border border-border/40 bg-muted p-4 sm:p-6",
          className
        )}
        ref={ref}
        {...props}
      >
        {title && (
          <div className="mb-8">
            <h2 className="font-bold font-mono text-foreground text-md uppercase tracking-widest">
              {title}
            </h2>
          </div>
        )}
        {children}
      </section>
    );
  }
);

SectionCard.displayName = "SectionCard";
