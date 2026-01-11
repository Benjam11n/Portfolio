import { JsonLd } from "@repo/seo/json-ld";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectNavigation } from "@/components/shared/project-navigation";
import { SectionCard } from "@/components/shared/section-card";
import { PROJECTS } from "@/lib/constants/projects";
import { ProjectDetailsGrid } from "./_components/project-details-grid";
import { ProjectHero } from "./_components/project-hero";
import { ProjectOverview } from "./_components/project-overview";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECTS[id];

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Portfolio`,
    description: project.description.replace(/\*\*/g, ""),
  };
}

export function generateStaticParams() {
  return Object.keys(PROJECTS).map((id) => ({
    id,
  }));
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = PROJECTS[id];

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto flex flex-col gap-4 px-2 py-2">
      <JsonLd
        code={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: project.title,
          description: project.description,
          applicationCategory: "WebApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          author: {
            "@type": "Person",
            name: "Benjamin Wang",
          },
        }}
      />
      {/* HERO SECTION */}
      <SectionCard>
        <ProjectHero project={project} />
      </SectionCard>

      {/* PROJECT DETAILS SECTION */}
      <SectionCard title="Project Details">
        <ProjectDetailsGrid project={project} />
      </SectionCard>

      {/* CONTENT AREA */}
      {!!project.subdesc && (
        <SectionCard title="Overview">
          <ProjectOverview project={project} />
          <ProjectNavigation currentId={id} />
        </SectionCard>
      )}
    </main>
  );
}
