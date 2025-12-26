import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface BorderedImageProps extends Omit<ImageProps, "className"> {
  containerClassName?: string;
  imageClassName?: string;
  backgroundColor?: string;
}

export const BorderedImage = ({
  src,
  alt,
  width,
  height,
  containerClassName,
  imageClassName,
  backgroundColor,
  ...props
}: BorderedImageProps) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border-4 border-white shadow-xl",
        containerClassName
      )}
      style={{ backgroundColor }}
    >
      <Image
        alt={alt}
        className={cn("h-full w-full object-cover", imageClassName)}
        height={height}
        src={src}
        width={width}
        {...props}
      />
    </div>
  );
};
