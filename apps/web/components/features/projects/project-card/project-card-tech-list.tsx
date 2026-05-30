import { Magnetic } from "@/components/effects/magnetic";
import { BorderedImage } from "@/components/shared/bordered-image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TECH_STACK_BY_ID } from "@/lib/constants/tech-stack";
import type { Project } from "@/lib/types";

interface ProjectCardTechListProps {
  techStack: Project["techStack"];
}

export const ProjectCardTechList = ({
  techStack,
}: ProjectCardTechListProps) => {
  if (techStack.length === 0) {
    return null;
  }

  return (
    <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
      {techStack.map((techId) => {
        const tech = TECH_STACK_BY_ID[techId];
        if (!tech) {
          return null;
        }

        return (
          <Magnetic key={techId}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-pointer">
                  <BorderedImage
                    alt={tech.name}
                    colorDark={tech.colorDark}
                    colorLight={tech.colorLight}
                    containerClassName="h-10 w-10 shrink-0"
                    height={20}
                    imageClassName="p-[6px]"
                    src={tech.icon}
                    width={20}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tech.name}</p>
              </TooltipContent>
            </Tooltip>
          </Magnetic>
        );
      })}
    </div>
  );
};
