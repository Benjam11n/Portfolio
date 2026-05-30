interface ProjectTitleParts {
  main: string;
  sub?: string;
}

export const splitProjectTitle = (title: string): ProjectTitleParts => {
  const [main, sub] = title.split(" - ");

  return { main, sub };
};

export const getPrimaryProjectTitle = (title: string) =>
  splitProjectTitle(title).main;
