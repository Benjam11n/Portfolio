"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { type AnchorHTMLAttributes, forwardRef } from "react";
import { ROUTES } from "@/lib/constants/navigation";

type ScrollLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    children?: React.ReactNode;
  };

export const ScrollLink = forwardRef<HTMLAnchorElement, ScrollLinkProps>(
  ({ children, href, ...props }, ref) => {
    const pathname = usePathname();

    // Construct the correct href for the Link component
    // If it's an anchor link and we're not on home, make it absolute (e.g. "/#about")
    const linkHref =
      pathname !== ROUTES.HOME && href.toString().startsWith("#")
        ? `/${href.toString()}`
        : href;

    return (
      <Link href={linkHref} ref={ref} {...props}>
        {children}
      </Link>
    );
  }
);

ScrollLink.displayName = "ScrollLink";
