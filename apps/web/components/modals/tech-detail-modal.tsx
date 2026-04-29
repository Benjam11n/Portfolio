"use client";

import { useCallback } from "react";

import { BorderedImage } from "@/components/shared/bordered-image";
import { RelatedProjectsList } from "@/components/shared/related-projects-list";
import { TechProficiencyIndicator } from "@/components/shared/tech-proficiency-indicator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TechStack } from "@/lib/types";

interface TechDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tech: TechStack;
}

export const TechDetailModal = ({
  isOpen,
  onClose,
  tech,
}: TechDetailModalProps) => {
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog modal={false} onOpenChange={handleOpenChange} open={isOpen}>
      <button
        aria-label="Close tech detail modal"
        className="fixed inset-0 z-50 bg-black/70"
        onClick={onClose}
        type="button"
      />
      <DialogContent className="max-h-[90vh] max-w-xl overflow-hidden rounded-xl border-border/40 bg-muted p-0 text-foreground">
        <DialogTitle className="sr-only">{tech.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Technology details and related projects for {tech.name}.
        </DialogDescription>

        <div className="flex max-h-[90vh] flex-col overflow-hidden">
          <div className="flex items-start justify-between p-4 pb-0 pr-14 sm:p-6 sm:pb-0 sm:pr-14">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-4">
                <BorderedImage
                  alt={tech.name}
                  colorDark={tech.colorDark}
                  colorLight={tech.colorLight}
                  containerClassName="h-16 w-16 shrink-0"
                  height={64}
                  imageClassName="p-1.5"
                  src={tech.icon}
                  width={64}
                />
                <h2 className="min-w-0 font-semibold text-foreground text-lg sm:text-xl">
                  {tech.name}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
            {tech.proficiency && (
              <div className="space-y-3">
                <h3 className="font-bold font-mono text-muted-foreground text-sm uppercase">
                  Proficiency Level
                </h3>
                <div className="rounded-xl border border-border/40 bg-background/55">
                  <div className="[&_span]:text-muted-foreground **:[[role=progressbar]]:bg-background">
                    <TechProficiencyIndicator
                      proficiency={tech.proficiency}
                      showLabel
                      variant="bar"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <RelatedProjectsList techName={tech.name} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
