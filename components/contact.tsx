"use client";

import { ArrowUpRight } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { CONTACT_INFO } from "@/constants";

export const Contact = () => {
  return (
    <SectionCard id="contact" title="Contact">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <h3 className="mb-4 font-medium text-lg">Get in touch</h3>
          <p className="mb-8 text-muted-foreground leading-relaxed">
            I'm currently looking for new opportunities. Whether you have a
            question or just want to say hi, I'll try my best to get back to
            you!
          </p>

          <div className="flex flex-col gap-4">
            {CONTACT_INFO.map((item) => (
              <a
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
                href={item.link}
                key={item.title}
                rel="noreferrer"
                target="_blank"
              >
                <item.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                <div className="flex-1">
                  <span className="block font-medium text-foreground text-sm">
                    {item.title}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {item.value || "Link"}
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-medium text-sm" htmlFor="name">
                Name
              </label>
              <input
                className="w-full rounded-lg border border-border bg-background px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                id="name"
                placeholder="John Doe"
                type="text"
              />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm" htmlFor="email">
                Email
              </label>
              <input
                className="w-full rounded-lg border border-border bg-background px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                id="email"
                placeholder="john@example.com"
                type="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-medium text-sm" htmlFor="message">
              Message
            </label>
            <textarea
              className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
              id="message"
              placeholder="Hello..."
              rows={5}
            />
          </div>

          <button
            className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            type="submit"
          >
            Send Message
          </button>
        </form>
      </div>
    </SectionCard>
  );
};
