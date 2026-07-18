import { m } from "framer-motion";

interface TechStackFadeOverlayProps {
  skipAnimations: boolean;
}

export const TechStackFadeOverlay = ({
  skipAnimations,
}: TechStackFadeOverlayProps) => (
  <m.div
    animate={{ opacity: 1 }}
    aria-hidden="true"
    className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-24 cursor-default bg-background/60 backdrop-blur-[2px] md:h-32"
    exit={{ opacity: 0 }}
    initial={{ opacity: 0 }}
    style={{
      WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 80%)",
      maskImage: "linear-gradient(to top, black 10%, transparent 80%)",
    }}
    transition={
      skipAnimations
        ? { duration: 0 }
        : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
    }
  />
);
