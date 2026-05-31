import { ProjectCard } from "@/components/features/projects/project-card";
import { ProjectsReveal } from "@/components/sections/projects-reveal";
import { SectionCard } from "@/components/shared/section-card";
import { PROJECTS } from "@/lib/constants/projects";

export const Projects = () => {
  const projects = Object.values(PROJECTS);

  return (
    <SectionCard id="projects" title="Projects">
      <ProjectsReveal>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ProjectsReveal>
    </SectionCard>
  );
};
