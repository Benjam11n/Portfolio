import { ContactReveal } from "@/components/sections/contact-reveal";
import { SectionCard } from "@/components/shared/section-card";
import { CONTACT_INFO } from "@/lib/constants/socials";

export const Contact = () => (
  <SectionCard id="contact" title="Contact">
    <ContactReveal>
      <div>
        <p className="mb-2 max-w-md font-sans text-md text-muted-foreground">
          I&apos;m always up for a chat. Whether you have a project in mind,
          want to collaborate, or just want to say hi, feel free to drop me a
          message.
        </p>
        <p className="mb-8 text-muted-foreground/60 text-xs italic">
          * Your information is not stored. It is sent directly to my personal
          accounts.
        </p>

        <div className="flex items-center gap-4">
          {CONTACT_INFO.map((item) => (
            <a
              className="group relative inline-flex items-center justify-center"
              href={item.link}
              key={item.title}
              rel="noopener noreferrer"
              target="_blank"
            >
              <item.icon className="size-5 text-foreground transition-transform duration-100 group-hover:-translate-y-1 group-hover:scale-110" />
              <span className="sr-only">{item.title}</span>
            </a>
          ))}
        </div>
      </div>
    </ContactReveal>
  </SectionCard>
);
