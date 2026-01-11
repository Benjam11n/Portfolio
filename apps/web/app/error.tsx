"use client";

import { logger } from "@repo/logger";
import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import FuzzyText from "@/components/bits/fuzzy-text";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    logger.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-8 text-center">
      <div className="relative">
        <FuzzyText
          baseIntensity={0.2}
          enableHover={true}
          fontSize="clamp(3rem, 10vw, 8rem)"
          fontWeight={900}
          hoverIntensity={0.5}
        >
          404
        </FuzzyText>
      </div>
      <div className="space-y-2">
        <h2 className="font-bold text-2xl tracking-tight">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground">An unexpected error occurred.</p>
      </div>
      <Button onClick={() => reset()}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
