import { PROJECTS } from "@/lib/constants/projects";
import { TECH_STACK } from "@/lib/constants/tech-stack";
import type { Project, TechId } from "@/lib/types";

/**
 * Finds projects that use a specific technology
 * @param techName - The display name of the technology to search for
 * @returns Array of projects that use the specified technology
 */
export const getProjectsByTech = (techName: string): Project[] => {
  const matchingTech = TECH_STACK.find(
    (tech) => tech.name.toLowerCase() === techName.toLowerCase()
  );

  if (!matchingTech) {
    return [];
  }

  return PROJECTS.filter((project) =>
    project.techStack.includes(matchingTech.id as TechId)
  );
};
