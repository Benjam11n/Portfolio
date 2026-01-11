"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { type AnchorHTMLAttributes, forwardRef, type MouseEvent } from "react";
import { ROUTES } from "@/lib/constants/navigation";

type ScrollLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    children?: React.ReactNode;
  };

export const ScrollLink = forwardRef<HTMLAnchorElement, ScrollLinkProps>(
  ({ children, onClick, href, ...props }, ref) => {
    const pathname = usePathname();

    const handleScroll = (e: MouseEvent<HTMLAnchorElement>) => {
      // Call standard onClick if provided
      if (onClick) {
        onClick(e);
      }

      const hrefStr = href.toString();
      const isAnchor = hrefStr.startsWith("#");

      // CASE 1: We are on the home page and it's an anchor link
      if (pathname === ROUTES.HOME && isAnchor) {
        e.preventDefault();
        const id = hrefStr.substring(1);
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          window.history.pushState(null, "", hrefStr);
        }
        return;
      }

      // CASE 2: We are NOT on home page, but it's an anchor link
      // We want to navigate to "/#section"
      if (pathname !== ROUTES.HOME && isAnchor) {
        // Let the Link component handle the navigation to "/" + hrefStr
        // But we need to ensure the href prop passed to Link is absolute
        // This is actually handled by modifying the href prop passed to <Link> below
      }
    };

    // Construct the correct href for the Link component
    // If it's an anchor link and we're not on home, make it absolute (e.g. "/#about")
    const linkHref =
      pathname !== ROUTES.HOME && href.toString().startsWith("#")
        ? `/${href.toString()}`
        : href;

    return (
      <Link href={linkHref} onClick={handleScroll} ref={ref} {...props}>
        {children}
      </Link>
    );
  }
);

ScrollLink.displayName = "ScrollLink";
