import type { LucideIcon } from "lucide-react";
import type React from "react";

export interface Project {
  id: string;
  title: string;
  description: string;
  subdesc?: string;
  year: string;
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
  hero_image?: string;
  logo: string;
  logoStyle?: React.CSSProperties;

  // Technologies used
  techStack: string[];

  // Features
  features?: string[];
  featureIcon?: (props: { className: string }) => React.JSX.Element;
}

export interface Experience {
  id: number;
  name: string;
  pos: string;
  duration: string;
  points: string[];
  icon: string;
}

export interface Certification {
  name: string;
  organization: string;
  date: string;
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
