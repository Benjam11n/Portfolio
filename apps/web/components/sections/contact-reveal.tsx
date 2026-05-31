"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import type { ReactNode } from "react";

import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useScrollReveal } from "@/lib/hooks/animation/use-scroll-reveal";
import { useShouldSkipEntranceAnimation } from "@/lib/hooks/animation/use-should-skip-entrance-animation";

interface ContactRevealProps {
  children: ReactNode;
}

const DynamicContactForm = dynamic(
  async () => {
    const mod = await import("@/components/forms/contact-form");
    return mod.ContactForm;
  },
  {
    loading: () => (
      <div className="min-h-72 rounded-xl border border-border/40 bg-card/50" />
    ),
    ssr: false,
  }
);

export const ContactReveal = ({ children }: ContactRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { skipAnimations } = useAnimationSkipContext();
  const shouldSkipEntranceAnimation = useShouldSkipEntranceAnimation();

  useScrollReveal(containerRef, "div > *", {
    duration: 0.3,
    skipAnimations: shouldSkipEntranceAnimation || skipAnimations,
    stagger: 0.08,
    y: 15,
  });

  return (
    <div className="flex flex-col gap-4" ref={containerRef}>
      {children}
      <DynamicContactForm />
    </div>
  );
};
