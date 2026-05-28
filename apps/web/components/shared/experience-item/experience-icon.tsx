import { BorderedImage } from "@/components/shared/bordered-image";
import {
  EXPERIENCE_DEFAULT_ICON_SCALE,
  EXPERIENCE_ICON_SIZE,
} from "@/components/shared/experience-item/constants";
import type { Experience } from "@/lib/types";

interface ExperienceIconProps {
  item: Experience;
  prefersReducedMotion: boolean;
}

export const ExperienceIcon = ({
  item,
  prefersReducedMotion,
}: ExperienceIconProps) => {
  const iconScale = item.iconScale ?? EXPERIENCE_DEFAULT_ICON_SCALE;
  const shouldAutoplayPreview =
    Boolean(item.preview_video) && !prefersReducedMotion;

  if (!shouldAutoplayPreview) {
    return (
      <BorderedImage
        alt={item.name}
        backgroundColor={item.iconBackgroundColor}
        containerClassName="h-14 w-14 shrink-0 bg-muted"
        height={EXPERIENCE_ICON_SIZE}
        imageClassName="p-2 object-contain"
        src={item.icon}
        style={{ transform: `scale(${iconScale})` }}
        width={EXPERIENCE_ICON_SIZE}
      />
    );
  }

  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-4 border-white bg-muted shadow-xl dark:border-black">
      <video
        aria-label={item.name}
        autoPlay
        className="h-full w-full object-contain p-2"
        loop
        muted
        playsInline
        preload="metadata"
        src={item.preview_video}
        style={{
          backgroundColor: item.iconBackgroundColor,
          transform: `scale(${iconScale})`,
        }}
      />
    </div>
  );
};
