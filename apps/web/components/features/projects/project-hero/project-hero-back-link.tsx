import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/lib/constants/navigation";

export const ProjectHeroBackLink = () => (
  <Link
    aria-label="Back to portfolio"
    className="hero-back group mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/80 px-3 py-2 text-muted-foreground shadow-sm ring-1 ring-black/5 backdrop-blur-md transition-all duration-300 hover:border-border hover:bg-secondary hover:text-foreground"
    href={ROUTES.HOME + ROUTES.PROJECTS}
  >
    <span className="flex size-7 items-center justify-center rounded-full bg-background/80 text-foreground shadow-inner ring-1 ring-border/40 transition-transform duration-300 group-hover:-translate-x-0.5">
      <ArrowLeft className="size-4" />
    </span>
    <span className="pr-1 font-medium text-sm tracking-tight">Back</span>
  </Link>
);
