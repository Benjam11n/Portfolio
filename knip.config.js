/** @type {import('knip').KnipConfig} */
export default {
  ignoreDependencies: ["oxfmt"],
  workspaces: {
    "apps/web": {
      entry: ["app/**/*.{ts,tsx}"],
      ignore: ["components/ui/**/*.{ts,tsx}"],
      ignoreDependencies: ["tailwindcss"],
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
