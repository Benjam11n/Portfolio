"use client";

import { useCallback, useState } from "react";

import type { TechStackItemData } from "@/components/sections/tech-stack/types";

export const useTechStackDetail = () => {
  const [selectedTech, setSelectedTech] = useState<TechStackItemData | null>(
    null
  );

  const handleCloseTechDetail = useCallback(() => {
    setSelectedTech(null);
  }, []);

  const handleSelectTech = useCallback((stack: TechStackItemData) => {
    setSelectedTech(stack);
  }, []);

  return {
    handleCloseTechDetail,
    handleSelectTech,
    selectedTech,
  };
};
