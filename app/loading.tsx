'use client';

import { TextShimmer } from '@/components/ui/text-shimmer';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full gap-8">
      <TextShimmer
        as="h1"
        className="text-xl md:text-2xl font-bold [--base-color:theme(colors.primary.DEFAULT)] [--base-gradient-color:theme(colors.primary.foreground)]"
        duration={1.5}
      >
        Loading...
      </TextShimmer>
    </div>
  );
}
