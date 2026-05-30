import { Mail } from "lucide-react";

import { Magnetic } from "@/components/effects/magnetic";
import { LightweightMarkdown } from "@/components/shared/lightweight-markdown";
import { ShiftButton } from "@/components/shared/shift-button";
import { ABOUT_CONTENT } from "@/lib/constants/about";
import { ROUTES } from "@/lib/constants/navigation";

export const AboutContent = () => (
  <>
    <div className="text-foreground text-md leading-relaxed">
      <div className="about-text translate-y-8 opacity-0">
        <LightweightMarkdown>{ABOUT_CONTENT.description}</LightweightMarkdown>
      </div>
    </div>

    <div className="about-button opacity-0">
      <Magnetic strength={0.25}>
        <ShiftButton
          href={ROUTES.CONTACT}
          icon={<Mail className="size-4" />}
          variant="primary"
        >
          Get in Touch
        </ShiftButton>
      </Magnetic>
    </div>
  </>
);
