import { Briefcase, Code2, Hammer, Home, Mail, User } from "lucide-react";

import type { NavItem } from "@/lib/types";

export const ROUTES = {
  ABOUT: "#about",
  BLOG: "/blog",
  CERTIFICATIONS: "#certifications",
  CONTACT: "#contact",
  EXPERIENCE: "#experience",
  HOME: "/",
  PRIVACY: "/privacy",
  PROJECTS: "#projects",
  PROJECT_DETAIL: (id: string) => `/projects/${id}`,
  SKILLS: "#skills",
} as const;

export const NAVITEMS: NavItem[] = [
  { href: ROUTES.HOME, icon: Home, name: "Home" },
  { href: ROUTES.ABOUT, icon: User, name: "About" },
  { href: ROUTES.EXPERIENCE, icon: Briefcase, name: "Experience" },
  { href: ROUTES.PROJECTS, icon: Hammer, name: "Projects" },
  { href: ROUTES.SKILLS, icon: Code2, name: "Skills" },
  { href: ROUTES.CONTACT, icon: Mail, name: "Contact" },
];
