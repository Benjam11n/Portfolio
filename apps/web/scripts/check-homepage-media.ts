import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { auditHomepageMedia } from "../lib/homepage-media/check-homepage-media";

const currentFilePath = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(currentFilePath), "..");
const publicDir = path.join(rootDir, "public");
const { issues } = auditHomepageMedia({ publicDir });

if (issues.length === 0) {
  console.log("Homepage media audit passed.");
  process.exit(0);
}

console.error("Homepage media audit failed:\n");
for (const issue of issues) {
  const details = [
    `item=${issue.itemId}`,
    `field=${issue.field}`,
    issue.path ? `path=${issue.path}` : null,
    issue.actualBytes === undefined ? null : `actual=${issue.actualBytes}`,
    issue.limitBytes === undefined ? null : `limit=${issue.limitBytes}`,
  ]
    .filter(Boolean)
    .join(" ");

  console.error(`- ${issue.message}${details ? ` (${details})` : ""}`);
}

process.exit(1);
