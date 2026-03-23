import Image from "next/image";
import type { ImageProps } from "next/image";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

type BorderedImageProps = Omit<ImageProps, "className"> & {
  containerClassName?: string;
  imageClassName?: string;
  backgroundColor?: string;
  colorLight?: string;
  colorDark?: string;
  fallback?: React.ReactNode;
};

export const BorderedImage = ({
  src,
  alt,
  width,
  height,
  containerClassName,
  imageClassName,
  backgroundColor,
  colorLight,
  colorDark,
  fallback,
  ...props
}: BorderedImageProps) => {
  const [hasError, setHasError] = useState(false);
  const handleImageError = useCallback(() => {
    setHasError(true);
  }, []);

  const style = {
    ...(backgroundColor && { backgroundColor }),
    ...(colorLight && { "--bg-light": colorLight }),
    ...(colorDark && { "--bg-dark": colorDark }),
  } as React.CSSProperties;

  if (hasError && fallback) {
    return (
      <div
        className={cn(
          (colorLight || colorDark) &&
            "bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]",
          "overflow-hidden rounded-xl border-4 border-white shadow-xl dark:border-black",
          containerClassName
        )}
        style={style}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div
      className={cn(
        (colorLight || colorDark) &&
          "bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]",
        "overflow-hidden rounded-xl border-4 border-white shadow-xl dark:border-black",
        containerClassName
      )}
      style={style}
    >
      <Image
        alt={alt}
        className={cn("h-full w-full object-cover", imageClassName)}
        height={height}
        onError={handleImageError}
        src={src}
        width={width}
        {...props}
      />
    </div>
  );
};
