import { Magnetic } from "@/components/effects/magnetic";
import { ScrollLink } from "@/components/shared/scroll-link";
import { ROUTES } from "@/lib/constants/navigation";

export const FooterCta = () => (
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
