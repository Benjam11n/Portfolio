"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ThankYouAnimation } from "@/components/effects/thank-you-animation";
import { ShiftSubmitButton } from "@/components/shared/shift-submit-button";
import { Form } from "@/components/ui/form";
import { useContactFormSubmit } from "@/lib/hooks/forms/use-contact-form-submit";
import {
  type ContactFormValues,
  contactFormSchema,
} from "@/lib/validations/contact";
import { FormInput } from "./form-input";
import { FormTextArea } from "./form-textarea";

export const ContactForm = () => {
  const [showThankYou, setShowThankYou] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      message: "",
      website: "",
    },
  });

  const { isPending, handleSubmit } = useContactFormSubmit({
    onSuccess: (name) => {
      setShowThankYou(true);
      toast.success(`Thanks ${name}!`, {
        description: "Your message has been sent successfully.",
      });
      form.reset();
    },
  });

  return (
    <div className="relative">
      {showThankYou && (
        <ThankYouAnimation onComplete={() => setShowThankYou(false)} />
      )}

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <input
            aria-hidden="true"
            autoComplete="off"
            className="pointer-events-none absolute top-auto -left-[9999px] h-px w-px overflow-hidden opacity-0"
            tabIndex={-1}
            type="text"
            {...form.register("website")}
          />

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
        </form>
      </Form>
    </div>
  );
};
