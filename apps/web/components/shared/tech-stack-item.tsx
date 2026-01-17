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
  const Wrapper = onClick ? "button" : "div";
  const wrapperProps = onClick
    ? {
        "aria-label": `View details for ${stack.name}`,
        className:
          "tech-item group relative flex h-full w-full items-center gap-2 rounded-xl bg-transparent border-0 p-0 cursor-pointer",
        onClick,
        type: "button" as const,
      }
    : {
        className: cn(
          "tech-item group relative flex h-full w-full items-center gap-2 rounded-xl",
          small ? "gap-2" : "gap-3"
        ),
      };

  return (
    <Card3D
      className={cn(
        "flex h-full items-center gap-3",
        small ? "gap-2 p-2" : "p-3"
      )}
      glare
      glareIntensity={0.6}
      parallaxIntensity={0}
      rotationIntensity={8}
      shadow={false}
      thickness={small ? 10 : 14}
    >
      <Wrapper {...wrapperProps}>
        <BorderedImage
          alt={stack.name}
          colorDark={stack.colorDark}
          colorLight={stack.colorLight}
          containerClassName={cn("shrink-0", small ? "h-10 w-10" : "h-14 w-14")}
          height={32}
          imageClassName={cn("object-contain", small ? "p-2" : "p-3")}
          src={stack.icon}
          width={32}
        />
        <div className="flex flex-col">
          <span
            className={cn(
              "font-semibold text-foreground leading-tight",
              small ? "text-sm" : "text-md"
            )}
          >
            {stack.name}
          </span>
          {!small && (
            <>
              <span className="font-medium text-muted-foreground text-sm">
                {stack.category}
              </span>
              {stack.proficiency && (
                <TechProficiencyIndicator
                  proficiency={stack.proficiency}
                  size="sm"
                  variant="dots"
                />
              )}
            </>
          )}
        </div>
      </Wrapper>
    </Card3D>
  );
};
