import { ExperienceExpandIcon } from "@/components/shared/experience-item/experience-expand-icon";
import { cn } from "@/lib/utils";

interface ExperienceMobileToggleProps {
  isOpen: boolean;
}

export const ExperienceMobileToggle = ({
  isOpen,
}: ExperienceMobileToggleProps) => (
  <div
    className={cn(
      "mt-4 flex items-center justify-between rounded-xl border border-border/60 bg-secondary/55 px-3 py-2 text-muted-foreground text-xs sm:hidden",
      isOpen && "border-primary/30 bg-primary/10 text-foreground"
    )}
  >
    <span className="font-medium tracking-wide">
      {isOpen ? "Tap to collapse" : "Tap to expand"}
    </span>
    <ExperienceExpandIcon isOpen={isOpen} />
  </div>
);
