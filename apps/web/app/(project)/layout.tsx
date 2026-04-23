import type { ReactNode } from "react";

import { LayoutShell } from "@/components/layout/layout-shell";

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return <LayoutShell footerShowCta={false}>{children}</LayoutShell>;
}
