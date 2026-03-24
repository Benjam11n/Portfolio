"use client";

import { Card3D } from "@/components/effects/card-3d";
import { Markdown } from "@/components/shared/markdown";

interface FeatureCardProps {
  feature: string;
  index: number;
}

export const FeatureCard = ({ feature, index }: FeatureCardProps) => (
  <Card3D
    className="h-full border border-border/50 bg-card p-5 shadow-sm transition-colors"
    containerClassName="feature-card h-full"
    glare
    glareIntensity={0.6}
    parallaxIntensity={0.02}
    rotationIntensity={2}
    thickness={4}
  >
    <div className="flex items-start gap-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary font-mono text-[10px] text-muted-foreground ring-1 ring-border/50">
        {(index + 1).toString().padStart(2, "0")}
      </div>
      <div className="min-w-0 flex-1 py-0.5 text-[15px] text-foreground/90 leading-relaxed">
        <Markdown className="[&_strong]:font-semibold [&_strong]:text-foreground">
          {feature}
        </Markdown>
      </div>
    </div>
  </Card3D>
);
