/** @type {import('knip').KnipConfig} */
export default {
  entry: ['app/**/*.{ts,tsx}'],
  project: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'constants/**/*.{ts,tsx}',
  ],
  ignore: [
    // Ignore Next.js special files
    'app/**/layout.tsx',
    'app/**/page.tsx',
    'app/**/loading.tsx',
    'app/**/error.tsx',
    'components/ui/**/*.{ts,tsx}',
  ],
};
