"use client";

import { Card3D } from "@/components/effects/card-3d";
import { BorderedImage } from "@/components/shared/bordered-image";
import { TechProficiencyIndicator } from "@/components/shared/tech-proficiency-indicator";
import {
  HOVER_CURSOR_ATTRIBUTE,
  HOVER_CURSOR_LABEL_ATTRIBUTE,
} from "@/lib/constants/interaction";
import type { TECH_STACK } from "@/lib/constants/tech-stack";
import { cn } from "@/lib/utils";

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const EMPTY_SEARCH_TERMS: string[] = [];

const highlightText = (text: string, searchTerms: string[]) => {
  if (searchTerms.length === 0) {
    return text;
  }

  const uniqueTerms = [...new Set(searchTerms.filter(Boolean))];

  if (uniqueTerms.length === 0) {
    return text;
  }

  const matcher = new RegExp(
    uniqueTerms.map((term) => escapeRegExp(term)).join("|"),
    "gi"
  );

  const segments: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(matcher)) {
    const matchedText = match[0];
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      segments.push(text.slice(lastIndex, matchIndex));
    }

    segments.push(
      <mark
        className="rounded-[0.35rem] bg-primary/15 px-1 py-0.5 text-foreground"
        key={`${matchedText}-${matchIndex}`}
      >
        {matchedText}
      </mark>
    );

    lastIndex = matchIndex + matchedText.length;
  }

  if (segments.length === 0) {
    return text;
  }

  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex));
  }

  return segments;
};

type TechStackItemProps = {
  stack: (typeof TECH_STACK)[0];
  small?: boolean;
  onClick?: () => void;
  searchTerms?: string[];
};

export const TechStackItem = ({
  stack,
  small = false,
  onClick,
  searchTerms = EMPTY_SEARCH_TERMS,
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
      rotationIntensity={4}
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
                searchTerms.length > 0 && "flex flex-wrap items-center gap-1",
                small ? "text-sm" : "text-base"
              )}
            >
              {highlightText(stack.name, searchTerms)}
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
              <span
                className={cn(
                  "w-full truncate font-medium text-muted-foreground text-xs",
                  searchTerms.length > 0 && "flex flex-wrap items-center gap-1"
                )}
              >
                {highlightText(stack.category, searchTerms)}
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
        {...{
          [HOVER_CURSOR_ATTRIBUTE]: "",
          [HOVER_CURSOR_LABEL_ATTRIBUTE]: "Click me!",
        }}
        onClick={onClick}
        type="button"
      >
        {CardContent}
      </button>
    );
  }

  return CardContent;
};
