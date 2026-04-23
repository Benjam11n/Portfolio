"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Magnetic } from "@/components/effects/magnetic";
import { ScrollLink } from "@/components/shared/scroll-link";
import { ROUTES } from "@/lib/constants/navigation";
import { CONTACT_INFO } from "@/lib/constants/socials";

export interface FooterProps {
  showCta?: boolean;
}

export const Footer = ({ showCta = true }: FooterProps) => {
  const [time, setTime] = useState("");
  const footerLinkClass =
    "inline-block w-fit text-muted-foreground transition-[color,transform] duration-200 hover:translate-x-1 hover:text-foreground hover:underline";
  const footerMetaLinkClass =
    "inline-block w-fit transition-[color,transform] duration-200 hover:translate-x-1 hover:text-foreground hover:underline";

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          hour12: true,
          minute: "2-digit",
          timeZoneName: "short",
        })
      );
    };

    const scheduleNextUpdate = () => {
      if (document.hidden) {
        return;
      }

      updateTime();

      const now = new Date();
      const millisecondsUntilNextMinute =
        (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

      timeoutId = setTimeout(
        scheduleNextUpdate,
        Math.max(millisecondsUntilNextMinute, 1000)
      );
    };

    const handleVisibilityChange = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }

      if (!document.hidden) {
        scheduleNextUpdate();
      }
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <footer className="relative mt-20 w-full overflow-hidden rounded-xl border border-border/40 bg-card pt-16 shadow-xl">
      <div className="container mx-auto px-4 sm:px-8">
        {showCta && (
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
        )}

        {/* Middle Section: Grid */}
        <div className="mb-24 grid grid-cols-1 gap-12 border-border/40 border-t pt-12 text-sm md:grid-cols-3 md:gap-8">
          {/* Navigation */}
          <div className="footer-column flex flex-col gap-4">
            <h3 className="font-mono text-muted-foreground/60 text-xs uppercase">
              Navigation
            </h3>
            <div className="flex flex-col gap-2">
              <ScrollLink className={footerLinkClass} href={ROUTES.HOME}>
                Home
              </ScrollLink>
              <ScrollLink className={footerLinkClass} href={ROUTES.ABOUT}>
                About
              </ScrollLink>
              <ScrollLink className={footerLinkClass} href={ROUTES.EXPERIENCE}>
                Experience
              </ScrollLink>
              <ScrollLink className={footerLinkClass} href={ROUTES.PROJECTS}>
                Projects
              </ScrollLink>
              <ScrollLink
                className={footerLinkClass}
                href={ROUTES.CERTIFICATIONS}
              >
                Certifications
              </ScrollLink>
            </div>
          </div>

          {/* Socials */}
          <div className="footer-column flex flex-col gap-4">
            <h3 className="font-mono text-muted-foreground/60 text-xs uppercase">
              Socials
            </h3>
            <div className="flex flex-col gap-2">
              {CONTACT_INFO.map((item) => (
                <a
                  className={footerLinkClass}
                  href={item.link}
                  key={item.title}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* Legal / Meta */}
          <div className="footer-column flex flex-col gap-4">
            <h3 className="font-mono text-muted-foreground/60 text-xs uppercase">
              Details
            </h3>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <p>{time || "Loading..."}</p>
              <p>© {new Date().getFullYear()} Benjamin Wang</p>
              <div className="mt-4 flex flex-col gap-2">
                <Link className={footerMetaLinkClass} href={ROUTES.PRIVACY}>
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
