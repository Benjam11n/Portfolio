import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
  Bot,
  Code2,
  LayoutGrid,
  Monitor,
  Server,
} from "lucide-react";

import { ProficiencyLevel, TechCategory } from "@/lib/types";

export const DEFAULT_VISIBLE_TECH_COUNT = 12;
export const BLURRED_COLLAPSED_TECH_COUNT = 2;
export const SEARCH_TERM_SPLIT_PATTERN = /\s+/;

export const CATEGORIES = [
  { icon: LayoutGrid, label: "All", value: "All" },
  { icon: Monitor, label: "Frontend", value: "Frontend" },
  { icon: Server, label: "Backend", value: "Backend" },
  { icon: Bot, label: "AI/ML", value: "AI/ML" },
  { icon: Code2, label: "Language", value: "Language" },
] as const;

export const SORT_OPTIONS = [
  { icon: ArrowUpDown, label: "Featured", value: "default" },
  {
    icon: ArrowDownWideNarrow,
    label: "Skill Level Desc",
    value: "proficiency-desc",
  },
  {
    icon: ArrowUpNarrowWide,
    label: "Skill Level Asc",
    value: "proficiency-asc",
  },
] as const;

export const CATEGORY_MAP: Record<
  Exclude<(typeof CATEGORIES)[number]["value"], "All">,
  TechCategory[]
> = {
  "AI/ML": [TechCategory.AI_ML],
  Backend: [TechCategory.BACKEND, TechCategory.DATABASE, TechCategory.DEVOPS],
  Frontend: [
    TechCategory.FRONTEND,
    TechCategory.ANIMATION,
    TechCategory.STYLING,
    TechCategory.FRAMEWORK,
    TechCategory.MOBILE,
  ],
  Language: [TechCategory.LANGUAGE],
};

export const PROFICIENCY_RANK: Record<ProficiencyLevel, number> = {
  [ProficiencyLevel.BEGINNER]: 0,
  [ProficiencyLevel.INTERMEDIATE]: 1,
  [ProficiencyLevel.ADVANCED]: 2,
  [ProficiencyLevel.EXPERT]: 3,
};

export const TAB_TRANSITION = {
  bounce: 0.19,
  duration: 0.4,
  type: "spring",
} as const;

export type CategoryFilter = (typeof CATEGORIES)[number]["value"];
export type SortFilter = (typeof SORT_OPTIONS)[number]["value"];
