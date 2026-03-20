"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TechStackCategoryTabOption<T extends string> = {
  label: string;
  value: T;
  icon: React.ComponentType<{ className?: string }>;
};

type TechStackCategoryTabsProps<T extends string> = {
  options: readonly TechStackCategoryTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function TechStackCategoryTabs<T extends string>({
  options,
  value,
  onChange,
}: TechStackCategoryTabsProps<T>) {
  return (
    <Tabs onValueChange={(nextValue) => onChange(nextValue as T)} value={value}>
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
}
