"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

type SuccessConfettiProps = {
  trigger?: boolean;
};

export const SuccessConfetti = ({ trigger = false }: SuccessConfettiProps) => {
  useEffect(() => {
    if (!trigger) {
      return;
    }

    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Burst from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"],
      });

      // Burst from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, [trigger]);

  return null;
};
