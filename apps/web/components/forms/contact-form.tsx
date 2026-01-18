"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ShiftSubmitButton } from "@/components/shared/shift-submit-button";
import { Form } from "@/components/ui/form";
import { useContactFormSubmit } from "@/lib/hooks/use-contact-form-submit";
import { useDeferredRecaptcha } from "@/lib/hooks/use-deferred-recaptcha";
import {
  type ContactFormValues,
  contactFormSchema,
} from "@/lib/validations/contact";
import { FormInput } from "./form-input";
import { FormSuccessModal } from "./form-success-modal";
import { FormTextArea } from "./form-textarea";

export const ContactForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [senderName, setSenderName] = useState("");

  const { loadRecaptcha } = useDeferredRecaptcha({});

  // Load reCAPTCHA on mount
  useEffect(() => {
    loadRecaptcha();
  }, [loadRecaptcha]);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const { isPending, handleSubmit } = useContactFormSubmit({
    onSuccess: (name) => {
      setSenderName(name);
      setShowSuccess(true);
      form.reset();
    },
  });

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSenderName("");
  };

  return (
    <>
      <FormSuccessModal
        isOpen={showSuccess}
        onClose={handleCloseSuccess}
        senderName={senderName}
      />

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              className="bg-card"
              control={form.control}
              disabled={isPending || form.formState.isSubmitting}
              id="contact-name"
              label="Name"
              name="name"
              placeholder="John Doe"
            />

            <FormInput
              className="bg-card"
              control={form.control}
              disabled={isPending || form.formState.isSubmitting}
              id="contact-email"
              label="Email"
              name="email"
              placeholder="johndoe@gmail.com"
            />
          </div>

          <FormTextArea
            className="bg-card"
            control={form.control}
            disabled={isPending || form.formState.isSubmitting}
            id="contact-message"
            label="Message"
            maxLength={1000}
            name="message"
            placeholder="Hello! I want to give you a job..."
            rows={8}
          />

          <ShiftSubmitButton isLoading={isPending} type="submit">
            Submit
          </ShiftSubmitButton>

          <p className="text-center text-[10px] text-muted-foreground/40">
            This site is protected by reCAPTCHA and the Google{" "}
            <a
              className="hover:underline"
              href="https://policies.google.com/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              className="hover:underline"
              href="https://policies.google.com/terms"
              rel="noopener noreferrer"
              target="_blank"
            >
              Terms of Service
            </a>{" "}
            apply.
          </p>
        </form>
      </Form>
    </>
  );
};
