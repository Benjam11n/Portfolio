"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { CertificationCard } from "@/components/shared/certification-card";
import { SectionCard } from "@/components/shared/section-card";
import { CERTIFICATIONS } from "@/lib/constants/certifications";

export const Certifications = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".cert-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom-=100",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <SectionCard id="certifications" ref={containerRef} title="Certifications">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {CERTIFICATIONS.map((cert) => (
          <div className="cert-card" key={cert.name}>
            <CertificationCard cert={cert} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
