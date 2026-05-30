"use client";

import { useCallback, useState } from "react";

import type { TechStackItemData } from "@/components/features/tech-stack/constants";

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
