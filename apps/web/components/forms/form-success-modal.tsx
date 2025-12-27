"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { SuccessConfetti } from "@/components/effects/success-confetti";

type FormSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  senderName?: string;
};

export const FormSuccessModal = ({
  isOpen,
  onClose,
  senderName = "there",
}: FormSuccessModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!isOpen) {
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Initial states
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { scale: 0.8, y: 50, opacity: 0 });
      gsap.set(iconRef.current, { scale: 0, rotation: -180 });
      gsap.set(".success-text", { y: 20, opacity: 0 });

      // Animation sequence
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
      })
        .to(
          contentRef.current,
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.1"
        )
        .to(
          iconRef.current,
          {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(2)",
          },
          "-=0.4"
        )
        .to(
          ".success-text",
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
          },
          "-=0.3"
        );
    },
    { scope: containerRef, dependencies: [isOpen] }
  );

  // Auto-dismiss after 4 seconds
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = setTimeout(() => {
      handleClose();
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose,
    });

    tl.to(".success-text", {
      y: -20,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
    })
      .to(
        iconRef.current,
        {
          scale: 0,
          rotation: 180,
          duration: 0.4,
        },
        "-=0.2"
      )
      .to(
        contentRef.current,
        {
          scale: 0.8,
          y: 50,
          opacity: 0,
          duration: 0.4,
        },
        "-=0.3"
      )
      .to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.3,
        },
        "-=0.2"
      );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div ref={containerRef}>
      <SuccessConfetti trigger={isOpen} />

      {/* Overlay */}
      <button
        aria-label="Close success modal"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            handleClose();
          }
        }}
        ref={overlayRef}
        type="button"
      />

      {/* Modal Content */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          aria-labelledby="success-modal-title"
          aria-modal="true"
          className="pointer-events-auto relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl"
          ref={contentRef}
          role="dialog"
        >
          {/* Animated Icon */}
          <div className="mb-6 flex justify-center" ref={iconRef}>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>

          {/* Success Text */}
          <div className="space-y-3 text-center">
            <h2
              className="success-text font-bold text-2xl text-foreground"
              id="success-modal-title"
            >
              Message Sent! 🎉
            </h2>
            <p className="success-text text-muted-foreground">
              Thanks for reaching out, {senderName}!
            </p>
            <p className="success-text text-muted-foreground text-sm">
              I'll get back to you as soon as possible.
            </p>
          </div>

          {/* Auto-dismiss indicator */}
          <div className="success-text mt-6 text-center text-muted-foreground text-xs">
            This will close automatically...
          </div>
        </div>
      </div>
    </div>
  );
};
