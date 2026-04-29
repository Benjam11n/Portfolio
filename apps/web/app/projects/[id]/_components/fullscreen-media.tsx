"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface FullscreenMediaProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  type: "image" | "video";
}

export const FullscreenMedia = ({
  isOpen,
  onClose,
  src,
  type,
}: FullscreenMediaProps) => {
  const [imageError, setImageError] = useState(false);
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogContent className="h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] border-0 bg-black/95 p-4 text-white shadow-none sm:rounded-2xl md:p-10 [&>button]:bg-white/10 [&>button]:text-white [&>button]:hover:bg-white/20">
        <DialogTitle className="sr-only">Fullscreen media preview</DialogTitle>
        <DialogDescription className="sr-only">
          Enlarged project media preview.
        </DialogDescription>
        {type === "image" ? (
          <div className="relative h-full w-full">
            {imageError ? (
              <div className="flex h-full w-full items-center justify-center text-white">
                Image failed to load
              </div>
            ) : (
              <Image
                alt="Full screen view"
                className="object-contain"
                fill
                onError={handleImageError}
                sizes="100vw"
                src={src}
              />
            )}
          </div>
        ) : (
          <video
            autoPlay
            className="h-full w-full rounded-2xl object-contain shadow-2xl"
            controls
            loop
            muted
            playsInline
            src={src}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
