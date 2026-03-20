"use client";

import { Pause, Waves } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";

export function AnimationSkipReset() {
  const { skipAnimations } = useAnimationSkipContext();

  return (
    <Card className="fixed right-4 bottom-4 z-120 flex items-center gap-2 border-border/60 bg-background/92 p-1 shadow-lg backdrop-blur sm:right-6 sm:bottom-6">
      <div
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-foreground/6"
      >
        {skipAnimations ? (
          <Pause className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <Waves className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>

      <span className="whitespace-nowrap text-muted-foreground text-xs">
        {skipAnimations ? "Animations Paused" : "Animations Running"}
      </span>
      <Kbd>Esc</Kbd>
    </Card>
  );
}
