import type { ReactNode } from "react";

import { LayoutShell } from "@/components/layout/layout-shell";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <LayoutShell>{children}</LayoutShell>;
}
