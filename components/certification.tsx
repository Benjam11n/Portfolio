"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { SectionCard } from "@/components/section-card";
import { certifications } from "@/constants";
import { CertificationCard } from "./certification-card";

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
          duration: 0.8,
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
        {certifications.map((cert) => (
          <div className="cert-card" key={cert.name}>
            <CertificationCard cert={cert} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
