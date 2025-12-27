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
  featureIcon?: (props: { className: string }) => React.JSX.Element;
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

export type ContactInfo = {
  icon: LucideIcon;
  title: string;
  value?: string;
  link: string;
};
