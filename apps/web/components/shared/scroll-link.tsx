"use client";

import Link, { type LinkProps } from "next/link";
import { type AnchorHTMLAttributes, forwardRef, type MouseEvent } from "react";

type ScrollLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    children?: React.ReactNode;
  };

export const ScrollLink = forwardRef<HTMLAnchorElement, ScrollLinkProps>(
  ({ children, onClick, href, ...props }, ref) => {
    const handleScroll = (e: MouseEvent<HTMLAnchorElement>) => {
      // Call standard onClick if provided
      if (onClick) {
        onClick(e);
      }

      // Handle anchor links
      const hrefStr = href.toString();
      if (hrefStr.startsWith("#")) {
        e.preventDefault();
        const id = hrefStr.substring(1);
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Manually push state so the URL updates without router refresh
          window.history.pushState(null, "", hrefStr);
        }
      }
    };

    return (
      <Link href={href} onClick={handleScroll} ref={ref} {...props}>
        {children}
      </Link>
    );
  }
);

ScrollLink.displayName = "ScrollLink";
