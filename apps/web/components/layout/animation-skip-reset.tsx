"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";

export function AnimationSkipReset() {
  const { resetSkipAnimations, skipAnimations } = useAnimationSkipContext();

  if (!skipAnimations) {
    return null;
  }

  return (
    <Card className="fixed right-4 bottom-4 z-120 flex items-center gap-3 border border-border/60 bg-background/95 px-2 py-1 shadow-lg backdrop-blur sm:right-6 sm:bottom-6">
      <p className="text-muted-foreground text-sm">Animations paused</p>
      <Button
        className="rounded-full"
        onClick={resetSkipAnimations}
        size="sm"
        type="button"
        variant="secondary"
      >
        <Play className="h-4 w-4" />
      </Button>
    </Card>
  );
}
