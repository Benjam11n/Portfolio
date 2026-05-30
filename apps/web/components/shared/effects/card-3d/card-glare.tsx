import type { RefObject } from "react";

interface CardGlareProps {
  enabled: boolean;
  glareRef: RefObject<HTMLDivElement | null>;
}

export const CardGlare = ({ enabled, glareRef }: CardGlareProps) =>
  enabled ? (
    <div
      className="pointer-events-none absolute top-1/2 left-1/2 size-[250%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_50%)] opacity-0 mix-blend-plus-lighter"
      ref={glareRef}
      style={{ transform: "translateZ(1px)" }}
    />
  ) : null;
