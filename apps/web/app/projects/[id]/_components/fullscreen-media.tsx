"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

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
  const handleRootClick = useCallback(() => {
    onClose();
  }, [onClose]);
  const handleButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onClose();
    },
    [onClose]
  );
  const handleContentClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
    },
    []
  );
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={handleRootClick}
        >
          <motion.button
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-6 right-6 z-[110] rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            exit={{ opacity: 0, scale: 0.8 }}
            initial={{ opacity: 0, scale: 0.8 }}
            onClick={handleButtonClick}
          >
            <X className="h-6 w-6" />
          </motion.button>

          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative h-full w-full max-w-7xl"
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={handleContentClick}
          >
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
