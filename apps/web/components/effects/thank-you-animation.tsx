"use client";

import { useGSAP } from "@gsap/react";
import confetti from "canvas-confetti";
import gsapCore from "gsap";
import { CheckCircle } from "lucide-react";
import { useRef } from "react";

interface ThankYouAnimationProps {
  onComplete: () => void;
}

export const ThankYouAnimation = ({ onComplete }: ThankYouAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsapCore.timeline({
        onComplete,
      });

      // Entry animation
      tl.from(containerRef.current, {
        duration: 0.5,
        ease: "back.out(1.7)",
        opacity: 0,
        scale: 0.8,
      });

      // Confetti burst
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 100,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        decay: 0.91,
        scalar: 0.8,
        spread: 100,
      });
      fire(0.1, {
        decay: 0.92,
        scalar: 1.2,
        spread: 120,
        startVelocity: 25,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });

      // Exit animation after delay
      tl.to(containerRef.current, {
        delay: 3.5,
        duration: 0.5,
        ease: "power2.in",
        opacity: 0,
        scale: 0.8,
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-background/95 p-6 text-center opacity-0 shadow-2xl backdrop-blur-md"
      ref={containerRef}
    >
      <div className="mb-6 rounded-full bg-primary/10 p-4 ring-1 ring-primary/20">
        <CheckCircle className="h-16 w-16 text-primary" />
      </div>
      <h3 className="mb-2 font-bold text-3xl tracking-tight">Thank You!</h3>
      <p className="max-w-[80%] text-lg text-muted-foreground">
        Your message has been sent successfully. <br /> I&apos;ll get back to
        you soon!
      </p>
    </div>
  );
};
