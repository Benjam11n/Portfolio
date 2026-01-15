import type { LucideIcon } from "lucide-react";
import type React from "react";

export type Project = {
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
};

export type Experience = {
  id: number;
  name: string;
  pos: string;
  duration: string;
  points: string[];
  icon: string;
};

export type Certification = {
  name: string;
  organization: string;
  date: string;
  image: string;
  description: string;
};

export type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const TechCategory = {
  AI_ML: "AI/ML",
  ANIMATION: "Animation",
  MOBILE: "Mobile",
  FRAMEWORK: "Framework",
  BACKEND: "Backend",
  FRONTEND: "Frontend",
  STYLING: "Styling",
  LANGUAGE: "Language",
  DATABASE: "Database",
  DEVOPS: "DevOps",
} as const;

export type TechCategory = (typeof TechCategory)[keyof typeof TechCategory];

export type TechStack = {
  name: string;
  icon: string;
  category: TechCategory;
  colorLight: string;
  colorDark: string;
};

export type ContactInfo = {
  icon: LucideIcon;
  title: string;
  value?: string;
  link: string;
};
