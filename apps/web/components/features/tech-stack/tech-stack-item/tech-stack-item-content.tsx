import { itemSizeConfig } from "@/components/features/tech-stack/tech-stack-item/constants";
import { TechStackIcon } from "@/components/features/tech-stack/tech-stack-item/tech-stack-icon";
import { TechStackText } from "@/components/features/tech-stack/tech-stack-item/tech-stack-text";
import { Card3D } from "@/components/shared/effects/card-3d";
import type { TechStack } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TechStackItemContentProps {
  searchTerms: string[];
  small: boolean;
  stack: TechStack;
}

export const TechStackItemContent = ({
  searchTerms,
  small,
  stack,
}: TechStackItemContentProps) => {
  const config = small ? itemSizeConfig.small : itemSizeConfig.large;

  return (
    <Card3D
      className={cn("flex h-full items-center", config.cardClass)}
      shadow={false}
      variant="skill"
    >
      <div className="flex h-full w-full items-center">
        <TechStackIcon config={config} stack={stack} />
        <TechStackText
          config={config}
          searchTerms={searchTerms}
          showMeta={!small}
          stack={stack}
        />
      </div>
    </Card3D>
  );
};
