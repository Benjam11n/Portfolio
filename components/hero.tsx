"use client";

import { BadgeCheck } from "lucide-react";
import { BorderedImage } from "@/components/ui/bordered-image";
import { ShiftButton } from "@/components/ui/shift-button";
import { SectionCard } from "./section-card";

export const Hero = () => {
  return (
    <SectionCard id="hero">
      <div>
        {/* Profile Image */}
        <BorderedImage
          alt="Benjamin Wang"
          containerClassName="mb-6 h-[72px] w-[72px]"
          height={72}
          src="/me.png"
          width={72}
        />

        {/* Name and Badge */}
        <div className="mb-2 flex items-center gap-2">
          <h1 className="font-bold text-foreground text-xl tracking-tight sm:text-2xl">
            Benjamin Wang
          </h1>
          <BadgeCheck className="h-6 w-6 text-primary" />
        </div>

        {/* Role */}
        <h2 className="mb-6 font-medium text-md text-muted-foreground">
          Web Designer
        </h2>

        {/* Description */}
        <p className="mb-8 max-w-sm font-sans text-foreground text-md leading-relaxed">
          Crafting interactive, user-centered experiences that bring ideas to
          life through thoughtful design and seamless digital execution.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <ShiftButton href="#contact" variant="primary">
            Contact Me
          </ShiftButton>
          <ShiftButton href="#projects" variant="secondary">
            View Projects
          </ShiftButton>
        </div>
      </div>
    </SectionCard>
  );
};
