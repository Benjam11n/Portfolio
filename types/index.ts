import type { LucideIcon } from "lucide-react";
import type React from "react";

export type ProjectTechnology = {
  name: string;
  colorLight: string;
  colorDark: string;
  size?: "sm" | "md" | "lg" | "xl";
  icon?: (props: { className: string }) => React.JSX.Element;
  path: string;
};

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
  texture?: string;
  logo: string;
  logoStyle?: React.CSSProperties;
  spotlight: string;

  // Technologies used
  techStack: ProjectTechnology[];

  // Features
  features?: string[];
  featureIcon?: (props: { className: string }) => React.JSX.Element;
};

export type Experience = {
  id: number;
  name: string;
  pos: string;
  duration: string;
  title: string;
  icon: string;
  texture: string;
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

export type ContactInfo = {
  icon: LucideIcon;
  title: string;
  value?: string;
  link: string;
};
