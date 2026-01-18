"use client";

import { Card3D } from "@/components/effects/card-3d";
import { BorderedImage } from "@/components/shared/bordered-image";
import { TechProficiencyIndicator } from "@/components/shared/tech-proficiency-indicator";
import type { TECH_STACK } from "@/lib/constants/tech-stack";
import { cn } from "@/lib/utils";

type TechStackItemProps = {
  stack: (typeof TECH_STACK)[0];
  small?: boolean;
  onClick?: () => void;
};

export const TechStackItem = ({
  stack,
  small = false,
  onClick,
}: TechStackItemProps) => {
  const imageSize = small ? 40 : 56;
  const imageContainerClass = small ? "h-10 w-10" : "h-14 w-14";

  const CardContent = (
    <Card3D
      className={cn(
        "flex h-full items-center",
        small ? "gap-2 p-2" : "gap-3 p-3"
      )}
      glare
      glareIntensity={0.6}
      parallaxIntensity={0}
      rotationIntensity={8}
      shadow={false}
      thickness={small ? 10 : 14}
    >
      <div className="flex h-full w-full items-center">
        {/* Fixed Width Icon Container - guarantee no shrinking */}
        <div className={cn("relative shrink-0", imageContainerClass)}>
          <BorderedImage
            alt={stack.name}
            colorDark={stack.colorDark}
            colorLight={stack.colorLight}
            containerClassName="h-full w-full"
            height={imageSize}
            imageClassName={cn("object-contain", small ? "p-1.5" : "p-1")}
            src={stack.icon}
            width={imageSize}
          />
        </div>

        {/* Content Container - Takes remaining space and handles truncation */}
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col justify-center",
            small ? "ml-2" : "ml-3"
          )}
        >
          <div className="flex items-center">
            <span
              className={cn(
                "w-full truncate font-semibold text-foreground leading-tight",
                small ? "text-sm" : "text-base"
              )}
            >
              {stack.name}
            </span>
          </div>

          {!small && (
            <div className="mt-0.5 flex flex-col">
              {stack.proficiency && (
                <div className="mb-1 ml-0.5">
                  <TechProficiencyIndicator
                    proficiency={stack.proficiency}
                    size="sm"
                    variant="dots"
                  />
                </div>
              )}
              <span className="w-full truncate font-medium text-muted-foreground text-xs">
                {stack.category}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card3D>
  );

  if (onClick) {
    return (
      <button
        aria-label={`View details for ${stack.name}`}
        className="flex h-full w-full cursor-pointer items-center rounded-xl border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        onClick={onClick}
        type="button"
      >
        {CardContent}
      </button>
    );
  }

  return CardContent;
};
