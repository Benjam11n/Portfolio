import { ArrowUpRight, Mail } from "lucide-react";
import type { RefObject } from "react";

import { Magnetic } from "@/components/effects/magnetic";
import { ShiftButton } from "@/components/shared/shift-button";
import { ROUTES } from "@/lib/constants/navigation";

interface HeroActionsProps {
  buttonsRef: RefObject<HTMLDivElement | null>;
}

export const HeroActions = ({ buttonsRef }: HeroActionsProps) => (
  <div className="flex flex-wrap gap-4" ref={buttonsRef}>
    <div className="translate-y-5 opacity-0">
      <Magnetic strength={0.2}>
        <ShiftButton
          href={ROUTES.CONTACT}
          icon={<Mail className="size-4" />}
          variant="primary"
        >
          Contact Me
        </ShiftButton>
      </Magnetic>
    </div>
    <div className="translate-y-5 opacity-0">
      <Magnetic strength={0.2}>
        <ShiftButton
          href={ROUTES.PROJECTS}
          icon={<ArrowUpRight className="size-4" />}
          variant="secondary"
        >
          View Projects
        </ShiftButton>
      </Magnetic>
    </div>
  </div>
);
