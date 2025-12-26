/** @type {import('knip').KnipConfig} */
export default {
  workspaces: {
    "apps/web": {
      entry: ["app/**/*.{ts,tsx}", "proxy.ts"],
      project: ["**/*.{ts,tsx}"],
      ignore: [
        "app/**/layout.tsx",
        "app/**/page.tsx",
        "app/**/loading.tsx",
        "app/**/error.tsx",
        "components/ui/**/*.{ts,tsx}",
      ],
    },
    "packages/*": {
      entry: ["src/index.ts", "index.ts"],
      project: ["**/*.{ts,tsx}"],
    },
  },
};
