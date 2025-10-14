'use client';

import { TextShimmer } from '@/components/ui/text-shimmer';

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
      <TextShimmer
        as="h1"
        className="[--base-color:theme(colors.primary.DEFAULT)] [--base-gradient-color:theme(colors.primary.foreground)] text-xl font-bold md:text-2xl"
        duration={1.5}
      >
        Loading...
      </TextShimmer>
    </div>
  );
}
