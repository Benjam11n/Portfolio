"use client";

import { SectionCard } from "@/components/section-card";
import { BorderedImage } from "@/components/ui/bordered-image";
import { STACKS } from "@/constants";

export const TechStack = () => {
  return (
    <SectionCard className="scroll-mt-24 p-6 sm:p-8" title="Stacks & Skills">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {STACKS.map((stack) => (
          <div
            className="group flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm transition-transform hover:scale-[1.02]"
            key={stack.name}
          >
            <BorderedImage
              alt={stack.name}
              containerClassName="h-14 w-14 shrink-0 bg-black"
              height={32}
              imageClassName="p-3 object-contain"
              src={stack.icon}
              width={32}
            />
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-lg">
                {stack.name}
              </span>
              <span className="font-medium text-gray-500 text-sm">
                {stack.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
