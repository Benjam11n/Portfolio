"use client";

import { logger } from "@repo/logger";
import { useTransition } from "react";
import { toast } from "sonner";
import { sendEmailAction } from "@/lib/actions/email.actions";
import {
  trackContactFormError,
  trackContactFormSuccess,
} from "@/lib/analytics/conversion";
import { useDeferredRecaptcha } from "@/lib/hooks/use-deferred-recaptcha";
import type { ContactFormValues } from "@/lib/validations/contact";

export type UseContactFormSubmitOptions = {
  onSuccess?: (name: string) => void;
};

export type UseContactFormSubmitReturn = {
  isPending: boolean;
  handleSubmit: (values: ContactFormValues) => Promise<void>;
};

/**
 * Custom hook to handle contact form submission logic.
 * Manages reCAPTCHA verification, form submission, and success/error states.
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
  const { executeRecaptcha, isRecaptchaReady, loadRecaptcha } =
    useDeferredRecaptcha({});

  const handleSubmit = async (values: ContactFormValues) => {
    if (!isRecaptchaReady) {
      trackContactFormError("recaptcha_not_ready", "main_form");
      toast.error("Security verification loading...");
      loadRecaptcha();
      return;
    }

    try {
      const token = await executeRecaptcha();

      if (!token) {
        trackContactFormError("recaptcha_token_missing", "main_form");
        toast.error("ReCAPTCHA verification failed");
        return;
      }

      startTransition(async () => {
        const result = await sendEmailAction({ ...values, token });

        if (result.error) {
          trackContactFormError("submission", "main_form");
          toast.error("Error", {
            description: result.error,
          });
        } else {
          trackContactFormSuccess("main_form");
          onSuccess?.(values.name);
        }
      });
    } catch (error) {
      trackContactFormError("verification_error", "main_form");
      toast.error("An error occurred during verification");
      logger.error(error);
    }
  };

  return {
    isPending,
    handleSubmit,
  };
};
