"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Magnetic } from "@/components/effects/magnetic";
import { ScrollLink } from "@/components/shared/scroll-link";
import { ROUTES } from "@/lib/constants/navigation";
import { CONTACT_INFO } from "@/lib/constants/socials";
import { cn } from "@/lib/utils";

interface FooterProps {
  showCta?: boolean;
}

const LINK_CLASS =
  "inline-block w-fit text-muted-foreground transition-[color,transform] duration-200 hover:translate-x-1 hover:text-foreground hover:underline";

const NAV_LINKS = [
  { href: ROUTES.HOME, label: "Home" },
  { href: ROUTES.ABOUT, label: "About" },
  { href: ROUTES.EXPERIENCE, label: "Experience" },
  { href: ROUTES.PROJECTS, label: "Projects" },
  { href: ROUTES.CERTIFICATIONS, label: "Certifications" },
] as const;

const formatTime = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    hour12: true,
    minute: "2-digit",
    timeZoneName: "short",
  });

const useFooterTime = () => {
  const [clock, setClock] = useState<{ time?: string; year?: number }>();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const scheduleUpdate = () => {
      if (document.hidden) {
        return;
      }

      const now = new Date();
      setClock({ time: formatTime(), year: now.getFullYear() });
      timeoutId = setTimeout(
        scheduleUpdate,
        Math.max((60 - now.getSeconds()) * 1000 - now.getMilliseconds(), 1000)
      );
    };

    const handleVisibilityChange = () => {
      clearTimeout(timeoutId);
      timeoutId = undefined;

      if (!document.hidden) {
        scheduleUpdate();
      }
    };

    timeoutId = setTimeout(scheduleUpdate, 0);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return clock;
};

const FooterColumn = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div className="footer-column flex flex-col gap-4">
    <h3 className="font-mono text-muted-foreground/60 text-xs uppercase">
      {title}
    </h3>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);

const FooterCta = () => (
  <div className="mb-16">
    <Magnetic strength={0.2}>
      <ScrollLink
        aria-label="Contact Me"
        className="group block"
        href={ROUTES.CONTACT}
      >
        <h2 className="footer-title max-w-xl font-bold font-heading text-4xl uppercase leading-[0.9] tracking-tighter transition-colors duration-200 group-hover:text-primary sm:text-5xl md:text-6xl lg:text-7xl">
          Have A Question?
        </h2>
      </ScrollLink>
    </Magnetic>
  </div>
);

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
            {NAV_LINKS.map((item) => (
              <ScrollLink
                className={LINK_CLASS}
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
                className={LINK_CLASS}
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
            <Link className={`${LINK_CLASS} mt-4`} href={ROUTES.PRIVACY}>
              Privacy Policy
            </Link>
          </FooterColumn>
        </div>
      </div>
    </footer>
  );
};
