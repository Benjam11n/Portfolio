import { Award, Briefcase, Hammer, Home, Mail, User } from "lucide-react";
import type { NavItem } from "@/types";

export const NAVITEMS: NavItem[] = [
  { name: "Home", href: "#home", icon: Home },
  { name: "About", href: "#about", icon: User },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "Projects", href: "#projects", icon: Hammer },
  { name: "Certifications", href: "#certifications", icon: Award },
  { name: "Contact", href: "#contact", icon: Mail },
];
