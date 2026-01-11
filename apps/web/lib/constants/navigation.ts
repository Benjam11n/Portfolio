import { Award, Briefcase, Hammer, Home, Mail, User } from "lucide-react";
import type { NavItem } from "@/lib/types";

export const ROUTES = {
  HOME: "/",
  ABOUT: "#about",
  EXPERIENCE: "#experience",
  PROJECTS: "#projects",
  CERTIFICATIONS: "#certifications",
  CONTACT: "#contact",
  BLOG: "/blog",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  PROJECT_DETAIL: (id: string) => `/projects/${id}`,
} as const;

export const NAVITEMS: NavItem[] = [
  { name: "Home", href: ROUTES.HOME, icon: Home },
  { name: "About", href: ROUTES.ABOUT, icon: User },
  { name: "Experience", href: ROUTES.EXPERIENCE, icon: Briefcase },
  { name: "Projects", href: ROUTES.PROJECTS, icon: Hammer },
  { name: "Certifications", href: ROUTES.CERTIFICATIONS, icon: Award },
  { name: "Contact", href: ROUTES.CONTACT, icon: Mail },
];
