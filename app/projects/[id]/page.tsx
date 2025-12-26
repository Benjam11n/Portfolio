import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BorderedImage } from "@/components/bordered-image";
import { PROJECTS } from "@/constants";

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
    description: project.description,
  };
}

// Generate static params for all projects
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
    <main className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          className="mb-8 inline-flex items-center gap-2 font-medium text-muted-foreground text-sm hover:text-foreground"
          href="/#projects"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card shadow-sm"
                style={project.logoStyle}
              >
                <Image
                  alt={project.title}
                  className="h-10 w-10 object-contain"
                  height={40}
                  src={project.logo}
                  width={40}
                />
              </div>
              <div>
                <h1 className="font-bold text-3xl tracking-tight sm:text-4xl">
                  {project.title.split(" - ")[0]}
                </h1>
                <p className="font-medium text-lg text-muted-foreground">
                  {project.title.split(" - ")[1]}
                </p>
              </div>
            </div>
            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex gap-3">
            {project.href && (
              <a
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-opacity hover:opacity-90"
                href={project.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </a>
            )}
            {project.github && (
              <a
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 font-medium text-sm transition-colors hover:bg-muted"
                href={project.github}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="h-4 w-4" />
                Source Code
              </a>
            )}
          </div>
        </div>

        {/* Media / Video */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-border bg-muted shadow-xl">
          <div className="aspect-video w-full">
            <video
              autoPlay
              className="h-full w-full object-cover"
              loop
              muted
              playsInline
              src={project.texture}
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-12 md:grid-cols-[2fr,1fr]">
          {/* Main Content */}
          <div className="space-y-12">
            <section>
              <h2 className="mb-6 font-bold text-2xl">Overview</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.subdesc}
              </p>
            </section>

            {project.features && project.features.length > 0 && (
              <section>
                <h2 className="mb-6 font-bold text-2xl">Key Features</h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {project.features.map((feature, index) => (
                    <li
                      className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary/20"
                      // biome-ignore lint/suspicious/noArrayIndexKey: Static features list with guaranteed order
                      key={`${feature}-${index}`}
                    >
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <section>
              <h3 className="mb-4 font-semibold text-lg">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <div
                    className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-sm transition-colors hover:bg-secondary/50"
                    key={tech.name}
                  >
                    <BorderedImage
                      alt={tech.name}
                      containerClassName="h-6 w-6 border-2"
                      height={20}
                      imageClassName="p-1"
                      src={tech.path}
                      width={20}
                    />
                    <span className="font-medium text-muted-foreground">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {project.status && (
              <section>
                <h3 className="mb-4 font-semibold text-lg">Status</h3>
                <div className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1 font-medium text-sm capitalize">
                  {project.status.replace("-", " ")}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
