"use client";

import { TextShimmer } from "@/components/effects/text-shimmer";

const Loading = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
      <TextShimmer
        as="h1"
        className="font-bold text-xl [--base-color:theme(colors.primary.DEFAULT)] [--base-gradient-color:theme(colors.primary.foreground)] md:text-2xl"
        duration={1.5}
      >
        Loading...
      </TextShimmer>
    </div>
  );
};

export default Loading;
