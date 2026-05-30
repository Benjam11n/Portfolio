"use client";

import { useCallback } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TechStackCategoryTabOption<T extends string> {
  label: string;
  value: T;
  icon: React.ComponentType<{ className?: string }>;
}

interface TechStackCategoryTabsProps<T extends string> {
  options: readonly TechStackCategoryTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export const TechStackCategoryTabs = <T extends string>({
  options,
  value,
  onChange,
}: TechStackCategoryTabsProps<T>) => {
  const handleValueChange = useCallback(
    (nextValue: string) => {
      onChange(nextValue as T);
    },
    [onChange]
  );

  return (
    <Tabs onValueChange={handleValueChange} value={value}>
      <div className="overflow-x-auto">
        <TabsList>
          {options.map((category) => {
            const Icon = category.icon;

            return (
              <TabsTrigger key={category.value} value={category.value}>
                <span className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{category.label}</span>
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    </Tabs>
  );
};
