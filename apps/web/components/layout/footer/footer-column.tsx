import type { ReactNode } from "react";

interface FooterColumnProps {
  children: ReactNode;
  title: string;
}

export const FooterColumn = ({ children, title }: FooterColumnProps) => (
  <div className="footer-column flex flex-col gap-4">
    <h3 className="font-mono text-muted-foreground/60 text-xs uppercase">
      {title}
    </h3>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);
