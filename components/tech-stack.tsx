"use client";

import { BorderedImage } from "@/components/bordered-image";
import { SectionCard } from "@/components/section-card";
import { STACKS } from "@/constants";

export const TechStack = () => {
  return (
    <SectionCard title="Stacks & Skills">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {STACKS.map((stack) => (
          <div
            className="group flex items-center gap-4 rounded-2xl border border-border/60 border-dashed bg-card p-3 shadow-sm transition-transform hover:scale-[1.02] hover:border-border/80"
            key={stack.name}
          >
            <BorderedImage
              alt={stack.name}
              colorDark={stack.colorDark}
              colorLight={stack.colorLight}
              containerClassName="h-14 w-14 shrink-0"
              height={32}
              imageClassName="p-3 object-contain"
              src={stack.icon}
              width={32}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-foreground text-md">
                {stack.name}
              </span>
              <span className="font-medium text-muted-foreground text-sm">
                {stack.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
