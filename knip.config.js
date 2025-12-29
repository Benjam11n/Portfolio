/** @type {import('knip').KnipConfig} */
export default {
  workspaces: {
    "apps/web": {
      entry: ["app/**/*.{ts,tsx}"],
      project: ["**/*.{ts,tsx}"],
      ignore: [
        "app/**/layout.tsx",
        "app/**/page.tsx",
        "app/**/loading.tsx",
        "app/**/error.tsx",
        "components/ui/**/*.{ts,tsx}",
      ],
      ignoreDependencies: ["tailwindcss", "ultracite"],
    },
    "packages/logger": {
      ignoreDependencies: ["pino-pretty"],
    },
    "packages/typescript-config": {
      entry: [],
      project: [],
      ignoreDependencies: ["next"],
    },
    "packages/*": {
      project: ["**/*.{ts,tsx}"],
    },
  },
};
