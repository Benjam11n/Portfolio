"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AnimationSkipContextValue {
  skipAnimations: boolean;
  setSkipAnimations: (value: boolean) => void;
  resetSkipAnimations: () => void;
}

const AnimationSkipContext = createContext<AnimationSkipContextValue | null>(
  null
);

export const AnimationSkipProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [skipAnimations, setSkipAnimations] = useState(false);
  const resetSkipAnimations = useCallback(() => {
    setSkipAnimations(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.repeat && event.key === "Escape") {
        setSkipAnimations((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const value = useMemo(
    () => ({
      resetSkipAnimations,
      setSkipAnimations,
      skipAnimations,
    }),
    [resetSkipAnimations, skipAnimations]
  );

  return (
    <AnimationSkipContext.Provider value={value}>
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
