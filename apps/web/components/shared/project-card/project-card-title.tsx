interface ProjectCardTitleProps {
  main: string;
  sub?: string;
}

export const ProjectCardTitle = ({ main, sub }: ProjectCardTitleProps) => (
  <h3 className="font-medium text-foreground text-md">
    {main}
    {sub && (
      <span className="text-muted-foreground">
        {" — "}
        {sub}
      </span>
    )}
  </h3>
);
