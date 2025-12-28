"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ROUTES } from "@/constants/navigation";
import { CONTACT_INFO } from "@/constants/socials";
import { ScrollLink } from "../shared/scroll-link";

export function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
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
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative mt-20 w-full overflow-hidden rounded-[2.5rem] border-border/40 border-t bg-card/60 pt-16 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Top Section: Massive CTA */}
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="flex flex-col gap-2">
            <h2 className="max-w-xl font-bold font-heading text-5xl uppercase leading-[0.9] tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
              Let&apos;s Work <br />
              <span className="text-muted-foreground/50">Together</span>
            </h2>
          </div>
          <ScrollLink
            className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-110 hover:bg-primary/90 md:h-24 md:w-24"
            href={ROUTES.CONTACT}
          >
            <ArrowUpRight className="h-10 w-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 md:h-12 md:w-12" />
          </ScrollLink>
        </div>

        {/* Middle Section: Grid */}
        <div className="mb-24 grid grid-cols-1 gap-12 border-border/40 border-t pt-12 text-sm md:grid-cols-3 md:gap-8">
          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-muted-foreground/60 text-xs uppercase">
              Navigation
            </h3>
            <div className="flex flex-col gap-2">
              <ScrollLink
                className="w-fit text-muted-foreground transition-colors hover:text-foreground hover:underline"
                href={ROUTES.HOME}
              >
                Home
              </ScrollLink>
              <ScrollLink
                className="w-fit text-muted-foreground transition-colors hover:text-foreground hover:underline"
                href={ROUTES.PROJECTS}
              >
                Projects
              </ScrollLink>
              <ScrollLink
                className="w-fit text-muted-foreground transition-colors hover:text-foreground hover:underline"
                href={ROUTES.ABOUT}
              >
                About
              </ScrollLink>
              <ScrollLink
                className="w-fit text-muted-foreground transition-colors hover:text-foreground hover:underline"
                href={ROUTES.BLOG}
              >
                Blog
              </ScrollLink>
            </div>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-muted-foreground/60 text-xs uppercase">
              Socials
            </h3>
            <div className="flex flex-col gap-2">
              {CONTACT_INFO.map((item) => (
                <a
                  className="w-fit text-muted-foreground transition-colors hover:text-foreground hover:underline"
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
          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-muted-foreground/60 text-xs uppercase">
              Details
            </h3>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <p>{time || "Loading..."}</p>
              <p>© {new Date().getFullYear()} Benjamin Wang</p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  className="w-fit transition-colors hover:text-foreground hover:underline"
                  href={ROUTES.TERMS}
                >
                  Terms of Service
                </Link>
                <Link
                  className="w-fit transition-colors hover:text-foreground hover:underline"
                  href={ROUTES.PRIVACY}
                >
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
