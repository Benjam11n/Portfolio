import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface BorderedImageProps extends Omit<ImageProps, "className"> {
  containerClassName?: string;
  imageClassName?: string;
  backgroundColor?: string;
  colorLight?: string;
  colorDark?: string;
}

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
  ...props
}: BorderedImageProps) => {
  const style = {
    ...(backgroundColor && { backgroundColor }),
    ...(colorLight && { "--bg-light": colorLight }),
    ...(colorDark && { "--bg-dark": colorDark }),
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        (colorLight || colorDark) &&
          "bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]",
        "overflow-hidden rounded-2xl border-4 border-white shadow-xl dark:border-black",
        containerClassName
      )}
      style={style}
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
