import { JsonLd } from "@repo/seo/json-ld";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetailsGrid } from "@/components/features/projects/project-details-grid";
import { ProjectHero } from "@/components/features/projects/project-hero";
import { ProjectNavigation } from "@/components/features/projects/project-navigation";
import { ProjectOverview } from "@/components/features/projects/project-overview";
import { SectionCard } from "@/components/shared/section-card";
import { PROJECTS } from "@/lib/constants/projects";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    description: `Project detail for ${project.title} - ${project.description.replaceAll("**", "")}`,
    title: `${project.title} | Benjamin Wang`,
  };
};

export const generateStaticParams = () =>
  PROJECTS.map((project) => ({
    id: project.id,
  }));

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto flex flex-col gap-4 p-2">
      <JsonLd
        code={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          applicationCategory: "WebApplication",
          author: {
            "@type": "Person",
            name: "Benjamin Wang Jiayuan",
          },
          description: project.description,
          name: project.title,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          operatingSystem: "Any",
        }}
      />
      <SectionCard>
        <ProjectHero project={project} />
      </SectionCard>

      <SectionCard title="Project Details">
        <ProjectDetailsGrid project={project} />
      </SectionCard>

      {!!project.subdesc && (
        <SectionCard title="Overview">
          <ProjectOverview project={project} />
          <ProjectNavigation currentId={id} />
        </SectionCard>
      )}
    </main>
  );
}
