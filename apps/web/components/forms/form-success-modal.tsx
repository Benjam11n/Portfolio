"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CheckCircle2 } from "lucide-react";
import { forwardRef, type HTMLAttributes, useRef } from "react";
import { SuccessConfetti } from "@/components/effects/success-confetti";
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  ANIMATION_STAGGER,
} from "@/lib/constants/animation";
import { useModalClose } from "@/lib/hooks/use-modal-close";
import { useModalCountdown } from "@/lib/hooks/use-modal-countdown";
import { cn } from "@/lib/utils";

type FormSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  senderName?: string;
};

// Modal-specific animation values (not in shared constants)
const MODAL_ANIMATION = {
  // Timeline positions (negative values create overlap)
  TIMELINE: {
    OVERLAY_CONTENT_OVERLAP: "-=0.1",
    CONTENT_ICON_OVERLAP: "-=0.4",
    ICON_TEXT_OVERLAP: "-=0.3",
    TEXT_ICON_EXIT_OVERLAP: "-=0.2",
    ICON_CONTENT_EXIT_OVERLAP: "-=0.3",
    CONTENT_OVERLAY_EXIT_OVERLAP: "-=0.2",
  },
  // Initial states
  INITIAL: {
    OVERLAY_OPACITY: 0,
    CONTENT_SCALE: 0.8,
    CONTENT_Y: 50,
    CONTENT_OPACITY: 0,
    ICON_SCALE: 0,
    ICON_ROTATION: -180,
    TEXT_Y: 20,
    TEXT_OPACITY: 0,
  },
  // Final states (exit animation)
  EXIT: {
    TEXT_Y: -20,
    TEXT_OPACITY: 0,
    ICON_SCALE: 0,
    ICON_ROTATION: 180,
    CONTENT_SCALE: 0.8,
    CONTENT_Y: 50,
    CONTENT_OPACITY: 0,
    OVERLAY_OPACITY: 0,
  },
  // Auto-dismiss timeout
  AUTO_DISMISS_MS: 4000,
} as const;

// ModalHeader component
export type ModalHeaderProps = HTMLAttributes<HTMLDivElement>;

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("mb-6 flex justify-center", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ModalHeader.displayName = "ModalHeader";

// ModalBody component
export type ModalBodyProps = HTMLAttributes<HTMLDivElement>;

const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("space-y-3 text-center", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ModalBody.displayName = "ModalBody";

// ModalFooter component
export type ModalFooterProps = HTMLAttributes<HTMLDivElement>;

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "mt-6 text-center text-muted-foreground text-xs",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ModalFooter.displayName = "ModalFooter";

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
        defaults: { ease: ANIMATION_EASING.POWER3 },
      });

      // Initial states
      gsap.set(overlayRef.current, {
        opacity: MODAL_ANIMATION.INITIAL.OVERLAY_OPACITY,
      });
      gsap.set(contentRef.current, {
        scale: MODAL_ANIMATION.INITIAL.CONTENT_SCALE,
        y: MODAL_ANIMATION.INITIAL.CONTENT_Y,
        opacity: MODAL_ANIMATION.INITIAL.CONTENT_OPACITY,
      });
      gsap.set(iconRef.current, {
        scale: MODAL_ANIMATION.INITIAL.ICON_SCALE,
        rotation: MODAL_ANIMATION.INITIAL.ICON_ROTATION,
      });
      gsap.set(".success-text", {
        y: MODAL_ANIMATION.INITIAL.TEXT_Y,
        opacity: MODAL_ANIMATION.INITIAL.TEXT_OPACITY,
      });

      // Animation sequence
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: ANIMATION_DURATION.QUICK / 1000,
      })
        .to(
          contentRef.current,
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: ANIMATION_DURATION.STANDARD / 1000,
            ease: ANIMATION_EASING.BACK_MEDIUM,
          },
          MODAL_ANIMATION.TIMELINE.OVERLAY_CONTENT_OVERLAP
        )
        .to(
          iconRef.current,
          {
            scale: 1,
            rotation: 0,
            duration: ANIMATION_DURATION.LONG / 1000,
            ease: ANIMATION_EASING.BACK_STRONG,
          },
          MODAL_ANIMATION.TIMELINE.CONTENT_ICON_OVERLAP
        )
        .to(
          ".success-text",
          {
            y: 0,
            opacity: 1,
            duration: ANIMATION_DURATION.MEDIUM_FAST / 1000,
            stagger: ANIMATION_STAGGER.STANDARD,
          },
          MODAL_ANIMATION.TIMELINE.ICON_TEXT_OVERLAP
        );
    },
    { scope: containerRef, dependencies: [isOpen] }
  );

  const handleClose = useModalClose({
    overlayRef,
    contentRef,
    iconRef,
    textSelector: ".success-text",
    animationConfig: {
      textY: MODAL_ANIMATION.EXIT.TEXT_Y,
      textOpacity: MODAL_ANIMATION.EXIT.TEXT_OPACITY,
      textDuration: ANIMATION_DURATION.QUICK / 1000,
      textStagger: ANIMATION_STAGGER.QUICK,
      iconScale: MODAL_ANIMATION.EXIT.ICON_SCALE,
      iconRotation: MODAL_ANIMATION.EXIT.ICON_ROTATION,
      iconDuration: ANIMATION_DURATION.SHORT / 1000,
      contentScale: MODAL_ANIMATION.EXIT.CONTENT_SCALE,
      contentY: MODAL_ANIMATION.EXIT.CONTENT_Y,
      contentOpacity: MODAL_ANIMATION.EXIT.CONTENT_OPACITY,
      contentDuration: ANIMATION_DURATION.SHORT / 1000,
      overlayOpacity: MODAL_ANIMATION.EXIT.OVERLAY_OPACITY,
      overlayDuration: ANIMATION_DURATION.QUICK / 1000,
      textIconOverlap: MODAL_ANIMATION.TIMELINE.TEXT_ICON_EXIT_OVERLAP,
      iconContentOverlap: MODAL_ANIMATION.TIMELINE.ICON_CONTENT_EXIT_OVERLAP,
      contentOverlayOverlap:
        MODAL_ANIMATION.TIMELINE.CONTENT_OVERLAY_EXIT_OVERLAP,
    },
    onClose,
  });

  // Auto-dismiss after configured timeout
  useModalCountdown({
    isActive: isOpen,
    duration: MODAL_ANIMATION.AUTO_DISMISS_MS,
    onComplete: handleClose,
  });

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
          <ModalHeader ref={iconRef}>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </ModalHeader>

          <ModalBody>
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
          </ModalBody>

          <ModalFooter>
            <div className="success-text">This will close automatically...</div>
          </ModalFooter>
        </div>
      </div>
    </div>
  );
};
