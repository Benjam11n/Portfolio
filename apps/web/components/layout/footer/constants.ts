import { ROUTES } from "@/lib/constants/navigation";

export const FOOTER_LINK_CLASS =
  "inline-block w-fit text-muted-foreground transition-[color,transform] duration-200 hover:translate-x-1 hover:text-foreground hover:underline";

export const FOOTER_NAV_LINKS = [
  { href: ROUTES.HOME, label: "Home" },
  { href: ROUTES.ABOUT, label: "About" },
  { href: ROUTES.EXPERIENCE, label: "Experience" },
  { href: ROUTES.PROJECTS, label: "Projects" },
  { href: ROUTES.CERTIFICATIONS, label: "Certifications" },
] as const;
