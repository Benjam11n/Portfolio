import { FeatureCard } from "@/components/features/projects/feature-card";

interface ProjectFeatureListProps {
  features: string[];
}

export const ProjectFeatureList = ({ features }: ProjectFeatureListProps) =>
  features.length > 0 ? (
    <div className="space-y-6">
      <h3 className="font-bold font-mono text-muted-foreground text-xs uppercase tracking-widest">
        Key Features
      </h3>
      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((feature, index) => (
          <li className="list-none" key={feature}>
            <FeatureCard feature={feature} index={index} />
          </li>
        ))}
      </ol>
    </div>
  ) : null;
