"use client";

import Link from "next/link";
import type { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, useCallback } from "react";
import type { AnchorHTMLAttributes } from "react";

import { ROUTES } from "@/lib/constants/navigation";

type ScrollLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    children?: React.ReactNode;
  };

export const ScrollLink = forwardRef<HTMLAnchorElement, ScrollLinkProps>(
  ({ children, href, onClick, ...props }, ref) => {
    const pathname = usePathname();
    const hashHref = href.toString();
    const isSamePageHashLink =
      pathname === ROUTES.HOME && hashHref.startsWith("#");

    // Construct the correct href for the Link component
    // If it's an anchor link and we're not on home, make it absolute (e.g. "/#about")
    const linkHref =
      pathname !== ROUTES.HOME && hashHref.startsWith("#")
        ? `/${hashHref}`
        : href;

    const handleClick = useCallback<
      NonNullable<AnchorHTMLAttributes<HTMLAnchorElement>["onClick"]>
    >(
      (event) => {
        onClick?.(event);

        if (
          event.defaultPrevented ||
          !isSamePageHashLink ||
          window.location.hash !== hashHref
        ) {
          return;
        }

        const targetElement = document.querySelector(hashHref);

        if (!targetElement) {
          return;
        }

        event.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      },
      [hashHref, isSamePageHashLink, onClick]
    );

    return (
      <Link href={linkHref} onClick={handleClick} ref={ref} {...props}>
        {children}
      </Link>
    );
  }
);

ScrollLink.displayName = "ScrollLink";
