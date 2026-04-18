import type { LucideIcon } from "lucide-react";
import type React from "react";

export const TECH_IDS = [
  "docker",
  "drizzle-orm",
  "electron",
  "fastapi",
  "framer",
  "golang",
  "gsap",
  "ionic",
  "java",
  "javascript",
  "mongodb",
  "nextjs",
  "nodejs",
  "numpy",
  "pandas",
  "postgres",
  "python",
  "pytorch",
  "react",
  "react-query",
  "shadcn-ui",
  "supabase",
  "tailwind",
  "tensorflow",
  "typescript",
  "vue",
  "vite",
  "zustand",
] as const;

export type TechId = (typeof TECH_IDS)[number];

export interface Project {
  id: string;
  title: string;
  description: string;
  subdesc?: string;
  year: number;
  client: string;
  services: string;
  location: string;
  status?: "completed" | "in-development" | "planned";

  // Links
  href?: string;
  link?: string;
  github?: string;

  // Visual elements
  video_overview?: string;
  preview_video?: string;
  preview_poster?: string;
  hero_image?: string;
  logo: string;
  logoStyle?: React.CSSProperties;

  // Technologies used
  techStack: TechId[];

  // Features
  features?: string[];
  featureIcon?: (props: { className: string }) => React.JSX.Element;
}

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface MonthYear {
  month: Month;
  year: number;
}

export interface Experience {
  id: number;
  name: string;
  pos: string;
  startDate: MonthYear;
  endDate?: MonthYear;
  points: string[];
  icon: string;
  preview_video?: string;
  preview_poster?: string;
  iconBackgroundColor?: string;
  iconScale?: number;
}

export interface Certification {
  name: string;
  organization: string;
  issuedAt: MonthYear;
  image: string;
  description: string;
}

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const TechCategory = {
  AI_ML: "AI/ML",
  ANIMATION: "Animation",
  BACKEND: "Backend",
  DATABASE: "Database",
  DEVOPS: "DevOps",
  FRAMEWORK: "Framework",
  FRONTEND: "Frontend",
  LANGUAGE: "Language",
  MOBILE: "Mobile",
  STYLING: "Styling",
} as const;

export type TechCategory = (typeof TechCategory)[keyof typeof TechCategory];

export const ProficiencyLevel = {
  ADVANCED: "advanced",
  BEGINNER: "beginner",
  EXPERT: "expert",
  INTERMEDIATE: "intermediate",
} as const;

export type ProficiencyLevel =
  (typeof ProficiencyLevel)[keyof typeof ProficiencyLevel];

export interface TechStack {
  id: TechId;
  name: string;
  icon: string;
  category: TechCategory;
  colorLight: string;
  colorDark: string;
  proficiency?: ProficiencyLevel;
}

export interface ContactInfo {
  icon: LucideIcon;
  title: string;
  value?: string;
  link: string;
}
