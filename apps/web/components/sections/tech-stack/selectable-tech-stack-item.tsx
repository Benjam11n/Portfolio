import { useCallback } from "react";

import type { TechStackItemData } from "@/components/sections/tech-stack/types";
import { TechStackItem } from "@/components/shared/tech-stack-item";

interface SelectableTechStackItemProps {
  searchTerms: string[];
  stack: TechStackItemData;
  onSelect: (stack: TechStackItemData) => void;
}

export const SelectableTechStackItem = ({
  searchTerms,
  stack,
  onSelect,
}: SelectableTechStackItemProps) => {
  const handleClick = useCallback(() => {
    onSelect(stack);
  }, [onSelect, stack]);

  return (
    <TechStackItem
      onClick={handleClick}
      searchTerms={searchTerms}
      stack={stack}
    />
  );
};
