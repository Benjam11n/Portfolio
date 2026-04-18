"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import { useAnimationSkip } from "@/lib/hooks/animation/use-animation-skip";

type AnimationSkipContextValue = ReturnType<typeof useAnimationSkip>;

const AnimationSkipContext = createContext<AnimationSkipContextValue | null>(
  null
);

export const AnimationSkipProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const animationSkip = useAnimationSkip();

  return (
    <AnimationSkipContext.Provider value={animationSkip}>
      {children}
    </AnimationSkipContext.Provider>
  );
};

export const useAnimationSkipContext = (): AnimationSkipContextValue => {
  const context = useContext(AnimationSkipContext);
  if (!context) {
    throw new Error(
      "useAnimationSkipContext must be used within an AnimationSkipProvider"
    );
  }
  return context;
};
