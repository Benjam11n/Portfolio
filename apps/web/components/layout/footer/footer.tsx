"use client";

import Link from "next/link";

import {
  FOOTER_LINK_CLASS,
  FOOTER_NAV_LINKS,
} from "@/components/layout/footer/constants";
import { FooterColumn } from "@/components/layout/footer/footer-column";
import { FooterCta } from "@/components/layout/footer/footer-cta";
import { useFooterTime } from "@/components/layout/footer/hooks";
import { ScrollLink } from "@/components/shared/scroll-link";
import { ROUTES } from "@/lib/constants/navigation";
import { CONTACT_INFO } from "@/lib/constants/socials";
import { cn } from "@/lib/utils";

interface FooterProps {
  showCta?: boolean;
}

export const Footer = ({ showCta = true }: FooterProps) => {
  const clock = useFooterTime();

  return (
    <footer className="relative mt-20 w-full overflow-hidden rounded-xl border border-border/40 bg-card pt-16 shadow-xl">
      <div className="container mx-auto px-4 sm:px-8">
        {showCta && <FooterCta />}

        <div
          className={cn(
            "mb-24 grid grid-cols-1 gap-12 text-sm md:grid-cols-3 md:gap-8",
            showCta && "border-border/40 border-t pt-12"
          )}
        >
          <FooterColumn title="Navigation">
            {FOOTER_NAV_LINKS.map((item) => (
              <ScrollLink
                className={FOOTER_LINK_CLASS}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </ScrollLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Socials">
            {CONTACT_INFO.map((item) => (
              <a
                className={FOOTER_LINK_CLASS}
                href={item.link}
                key={item.title}
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.title}
              </a>
            ))}
          </FooterColumn>

          <FooterColumn title="Details">
            <p>{clock?.time || "Loading..."}</p>
            <p>
              {clock?.year ? `© ${clock.year} Benjamin Wang` : "Benjamin Wang"}
            </p>
            <Link className={`${FOOTER_LINK_CLASS} mt-4`} href={ROUTES.PRIVACY}>
              Privacy Policy
            </Link>
          </FooterColumn>
        </div>
      </div>
    </footer>
  );
};
