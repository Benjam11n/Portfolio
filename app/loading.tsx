'use client';

import { TextShimmer } from '@/components/ui/text-shimmer';
import { AuroraBackground } from '@/components/ui/aurora-background';

export default function Loading() {
  return (
    <AuroraBackground className="min-h-screen">
      <div className="flex flex-col items-center justify-center gap-8">
        <TextShimmer
          as="h1"
          className="text-4xl md:text-6xl font-bold [--base-color:theme(colors.primary.DEFAULT)] [--base-gradient-color:theme(colors.primary.foreground)]"
          duration={1.5}
        >
          Loading...
        </TextShimmer>
        <TextShimmer
          className="text-lg md:text-xl text-muted-foreground"
          duration={2}
        >
          Preparing something amazing for you
        </TextShimmer>
      </div>
    </AuroraBackground>
  );
}
