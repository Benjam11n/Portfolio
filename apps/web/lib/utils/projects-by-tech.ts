import { PROJECTS } from "@/lib/constants/projects";
import type { Project } from "@/lib/types";

/**
 * Finds projects that use a specific technology
 * @param techName - The name of the technology to search for
 * @returns Array of projects that use the specified technology
 */
export const getProjectsByTech = (techName: string): Project[] =>
  PROJECTS.filter((project) => project.techStack.includes(techName));
