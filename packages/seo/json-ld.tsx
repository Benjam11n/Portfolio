import type { Thing, WithContext } from "schema-dts";

interface JsonLdProps {
  code: WithContext<Thing>;
}

const escapeJsonForHtml = (json: string): string =>
  json
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");

export const JsonLd = ({ code }: JsonLdProps) => (
  <script type="application/ld+json">
    {escapeJsonForHtml(JSON.stringify(code))}
  </script>
);

// Re-export specific types from schema-dts
export type { Thing, WithContext } from "schema-dts";
