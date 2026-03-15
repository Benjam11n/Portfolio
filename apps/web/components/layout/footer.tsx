"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ScrollLink } from "@/components/shared/scroll-link";
import { ROUTES } from "@/lib/constants/navigation";
import { CONTACT_INFO } from "@/lib/constants/socials";

export function Footer() {
  const containerRef = useRef<HTMLElement>(null);
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
          minute: "2-digit",
          hour12: true,
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
    <footer
      className="relative mt-20 w-full overflow-hidden rounded-xl border border-border/40 bg-card pt-16 shadow-xl"
      ref={containerRef}
    >
      <div className="container mx-auto px-4 sm:px-8">
        {/* Top Section: Massive CTA */}
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="flex flex-col gap-2">
            <ScrollLink
              aria-label="Contact Me"
              className="group block overflow-hidden"
              href={ROUTES.CONTACT}
            >
              <div className="h-23 overflow-hidden sm:h-28 md:h-34 lg:h-40">
                <div className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2">
                  <div className="flex h-23 items-start sm:h-28 md:h-34 lg:h-40">
                    <h2 className="footer-title max-w-xl font-bold font-heading text-4xl uppercase leading-[0.9] tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                      Have A <br />
                      <span className="text-muted-foreground">Question?</span>
                    </h2>
                  </div>

                  <div className="flex h-23 items-start sm:h-28 md:h-34 lg:h-40">
                    <h2 className="footer-title max-w-xl font-bold font-heading text-4xl uppercase leading-[0.9] tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                      Contact <br />
                      <span className="text-muted-foreground">Me</span>
                    </h2>
                  </div>
                </div>
              </div>
            </ScrollLink>
          </div>
          <div className="footer-cta">
            <ScrollLink
              aria-label="Contact Me"
              className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-110 hover:bg-primary/90 md:h-20 md:w-20"
              href={ROUTES.CONTACT}
            >
              <ArrowUpRight className="h-8 w-8 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 md:h-12 md:w-12" />
            </ScrollLink>
          </div>
        </div>

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
              {/* <ScrollLink
                className="w-fit text-muted-foreground transition-colors hover:text-foreground hover:underline"
                href={ROUTES.BLOG}
              >
                Blog
              </ScrollLink> */}
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
                <Link className={footerMetaLinkClass} href={ROUTES.TERMS}>
                  Terms of Service
                </Link>
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
}
