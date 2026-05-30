import type { itemSizeConfig } from "@/components/features/tech-stack/tech-stack-item/constants";
import { BorderedImage } from "@/components/shared/bordered-image";
import type { TechStack } from "@/lib/types";
import { cn } from "@/lib/utils";

type ItemSizeConfig = (typeof itemSizeConfig)[keyof typeof itemSizeConfig];

interface TechStackIconProps {
  config: ItemSizeConfig;
  stack: TechStack;
}

export const TechStackIcon = ({ config, stack }: TechStackIconProps) => (
  <div className={cn("relative shrink-0", config.imageClass)}>
    <BorderedImage
      alt={stack.name}
      colorDark={stack.colorDark}
      colorLight={stack.colorLight}
      containerClassName="h-full w-full"
      height={config.imageSize}
      imageClassName={cn("object-contain", config.imagePadding)}
      src={stack.icon}
      width={config.imageSize}
    />
  </div>
);
