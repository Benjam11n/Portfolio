"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface BackgroundVisibilityContextValue {
  isBackgroundDisabled: boolean;
  setBackgroundDisabled: (disabled: boolean) => void;
}

interface BackgroundVisibilityProviderProps {
  children: ReactNode;
}

const BackgroundVisibilityContext =
  createContext<BackgroundVisibilityContextValue | null>(null);

export const BackgroundVisibilityProvider = ({
  children,
}: BackgroundVisibilityProviderProps) => {
  const [isBackgroundDisabled, setBackgroundDisabled] = useState(false);
  const value = useMemo(
    () => ({ isBackgroundDisabled, setBackgroundDisabled }),
    [isBackgroundDisabled]
  );

  return (
    <BackgroundVisibilityContext value={value}>
      {children}
    </BackgroundVisibilityContext>
  );
};

export const useBackgroundVisibility = () => {
  const context = useContext(BackgroundVisibilityContext);
  if (!context) {
    throw new Error(
      "useBackgroundVisibility must be used within BackgroundVisibilityProvider"
    );
  }

  return context;
};

export const DisablePersistentBackground = () => {
  const { setBackgroundDisabled } = useBackgroundVisibility();

  useEffect(() => {
    setBackgroundDisabled(true);

    return () => {
      setBackgroundDisabled(false);
    };
  }, [setBackgroundDisabled]);

  return null;
};
