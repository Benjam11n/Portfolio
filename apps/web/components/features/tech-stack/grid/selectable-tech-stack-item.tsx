import { useCallback } from "react";

import type { TechStackItemData } from "@/components/features/tech-stack/constants";
import { TechStackItem } from "@/components/features/tech-stack/tech-stack-item";

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
  const selectStackItem = useCallback(() => {
    onSelect(stack);
  }, [onSelect, stack]);

  return (
    <TechStackItem
      onClick={selectStackItem}
      searchTerms={searchTerms}
      stack={stack}
    />
  );
};
