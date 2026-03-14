"use client";

import { logger } from "@repo/logger";
import { useTransition } from "react";
import { toast } from "sonner";
import { sendEmailAction } from "@/lib/actions/email.actions";
import {
  trackContactFormError,
  trackContactFormSuccess,
} from "@/lib/analytics/conversion";
import type { ContactFormValues } from "@/lib/validations/contact";

type UseContactFormSubmitOptions = {
  onSuccess?: (name: string) => void;
};

type UseContactFormSubmitReturn = {
  isPending: boolean;
  handleSubmit: (values: ContactFormValues) => void;
};

/**
 * Custom hook to handle contact form submission logic.
 * Manages contact form submission and success/error states.
 *
 * @example
 * ```tsx
 * const { isPending, handleSubmit } = useContactFormSubmit({
 *   onSuccess: (name) => setShowSuccess(true),
 * });
 *
 * <form onSubmit={form.handleSubmit(handleSubmit)}>
 *   // form fields
 * </form>
 * ```
 */
export const useContactFormSubmit = ({
  onSuccess,
}: UseContactFormSubmitOptions = {}): UseContactFormSubmitReturn => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (values: ContactFormValues) => {
    startTransition(async () => {
      try {
        const result = await sendEmailAction(values);

        if (result.error) {
          const isSpamBlocked =
            result.error === "Potential bot detected." ||
            result.error ===
              "You are sending too many requests. Please try again later." ||
            result.error === "Suspicious activity detected.";

          trackContactFormError(
            isSpamBlocked ? "spam_blocked" : "submission_failed",
            "main_form"
          );
          toast.error("Error", {
            description: result.error,
          });
          return;
        }

        trackContactFormSuccess("main_form");
        onSuccess?.(values.name);
      } catch (error) {
        trackContactFormError("unexpected_error", "main_form");
        toast.error("An unexpected error occurred");
        logger.error(error);
      }
    });
  };

  return {
    isPending,
    handleSubmit,
  };
};
