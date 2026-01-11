"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Magnetic } from "@/components/effects/magnetic";
import { SectionCard } from "@/components/shared/section-card";
import { ShiftButton } from "@/components/shared/shift-button";
import { ROUTES } from "@/lib/constants/navigation";

export const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [image1Error, setImage1Error] = useState(false);
  const [image2Error, setImage2Error] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power4.out" },
      });

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as {
            isDesktop: boolean;
          };
          const offset = isDesktop ? -220 : -40;

          // Images popup
          tl.fromTo(
            ".about-image-wrapper",
            {
              scale: 0,
              autoAlpha: 0,
              rotate: (i) => (i === 0 ? -15 : 15),
            },
            {
              scale: 1,
              autoAlpha: 1,
              rotate: (i) => (i === 0 ? -6 : 3),
              duration: 0.8,
              stagger: 0.2,
              ease: "elastic.out(1, 0.75)",
            }
          );

          // Parallax images on scroll
          gsap.to(".about-image", {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });

          // Text stagger
          tl.from(
            ".about-text",
            {
              y: 30,
              autoAlpha: 0,
              duration: 0.7,
              stagger: 0.15,
            },
            "-=0.8"
          );

          // Button pop
          tl.fromTo(
            ".about-button",
            {
              scale: 0,
              autoAlpha: 0,
              x: offset,
            },
            {
              scale: 1,
              autoAlpha: 1,
              x: 0,
              duration: 0.6,
              ease: "back.out(1.5)",
            },
            "-=0.6"
          );
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <SectionCard id="about" title="About Me">
      {/* Content Wrapper */}
      <div className="flex flex-col gap-4" ref={containerRef}>
        {/* Images Stack */}
        <div className="relative mx-auto mb-4 h-24 w-28 sm:mx-0 sm:h-36 sm:w-36">
          {/* Image 1 (Back) */}
          <div className="about-image-wrapper absolute top-0 left-0">
            <Magnetic strength={0.3}>
              <div className="about-image relative h-20 w-20 rotate-[-6deg] overflow-hidden rounded-xl border border-border bg-secondary shadow-lg sm:h-32 sm:w-32">
                {image1Error ? (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                    Photo
                  </div>
                ) : (
                  <Image
                    alt="Benjamin Wang"
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    fill
                    onError={() => setImage1Error(true)}
                    sizes="(max-width: 640px) 100px, 150px"
                    src="/benjamin.png"
                  />
                )}
              </div>
            </Magnetic>
          </div>

          {/* Image 2 (Front) */}
          <div className="about-image-wrapper absolute top-4 left-8 z-10 sm:left-12">
            <Magnetic strength={0.4}>
              <div className="about-image relative h-20 w-20 rotate-[3deg] overflow-hidden rounded-xl border-4 border-card bg-card shadow-xl sm:h-32 sm:w-32">
                {image2Error ? (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                    Workspace
                  </div>
                ) : (
                  <Image
                    alt="Minimal Workspace"
                    className="object-cover opacity-80"
                    fill
                    onError={() => setImage2Error(true)}
                    sizes="(max-width: 640px) 100px, 150px"
                    src="/assets/workspace.png"
                  />
                )}
              </div>
            </Magnetic>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-6 text-foreground text-md leading-relaxed">
          <p className="about-text">
            I'm Benjamin, a developer building intelligent solutions. My focus
            lies deep in the AI space, exploring how emerging technologies can
            reshape the way we solve real-world problems.
          </p>
          <p className="about-text">
            For me, code is just a medium. My real passion lies in creating
            experiences that are helpful and delightful. Whether it's a complex
            full-stack web app or an experimental AI model, I aim for simplicity
            and purpose in everything I ship.
          </p>
        </div>

        <div className="about-button">
          <Magnetic strength={0.25}>
            <ShiftButton
              href={ROUTES.CONTACT}
              icon={<Mail className="h-4 w-4" />}
              variant="primary"
            >
              Get in Touch
            </ShiftButton>
          </Magnetic>
        </div>
      </div>
    </SectionCard>
  );
};
