"use client";

import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { BorderedImage } from "@/components/ui/bordered-image";
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
          <h1 className="font-bold text-[#0F1419] text-xl tracking-tight sm:text-2xl">
            Benjamin Wang
          </h1>
          <BadgeCheck className="h-6 w-6 text-[#1D9BF0]" />
        </div>

        {/* Role */}
        <h2 className="mb-6 font-medium text-[#555555] text-md">
          Web Designer
        </h2>

        {/* Description */}
        <p className="mb-8 max-w-sm font-sans text-[#555555] text-md leading-relaxed">
          Crafting interactive, user-centered experiences that bring ideas to
          life through thoughtful design and seamless digital execution.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 font-bold text-sm text-white transition-transform hover:scale-105"
            href="#contact"
          >
            Contact Me
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 font-bold text-[#0F1419] text-sm shadow-sm transition-transform hover:scale-105 hover:bg-gray-50"
            href={"#projects"}
          >
            View Projects
          </Link>
        </div>
      </div>
    </SectionCard>
  );
};
