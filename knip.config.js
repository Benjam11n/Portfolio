/** @type {import('knip').KnipConfig} */
export default {
  workspaces: {
    "apps/web": {
      entry: ["app/**/*.{ts,tsx}"],
      ignore: [
        "app/**/layout.tsx",
        "app/**/page.tsx",
        "app/**/loading.tsx",
        "app/**/error.tsx",
        "components/ui/**/*.{ts,tsx}",
      ],
      ignoreDependencies: ["tailwindcss", "ultracite"],
      project: ["**/*.{ts,tsx}"],
    },
    "packages/*": {
      project: ["**/*.{ts,tsx}"],
    },
    "packages/logger": {
      ignoreDependencies: ["pino-pretty"],
    },
    "packages/typescript-config": {
      entry: [],
      ignoreDependencies: ["next"],
      project: [],
    },
  },
};
