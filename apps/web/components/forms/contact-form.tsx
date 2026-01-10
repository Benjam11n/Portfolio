"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "@repo/logger";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ShiftSubmitButton } from "@/components/shared/shift-submit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDeferredRecaptcha } from "@/hooks/use-deferred-recaptcha";
import { sendEmailAction } from "@/lib/actions/email.actions";
import {
  type ContactFormValues,
  contactFormSchema,
} from "@/lib/validations/contact";
import { FormSuccessModal } from "./form-success-modal";

export const ContactForm = () => {
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);
  const [senderName, setSenderName] = useState("");

  const { loadRecaptcha, executeRecaptcha, isRecaptchaReady } =
    useDeferredRecaptcha({});

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
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    if (!isRecaptchaReady) {
      toast.error("Security verification loading...");
      loadRecaptcha();
      return;
    }

    try {
      const token = await executeRecaptcha();

      if (!token) {
        toast.error("ReCAPTCHA verification failed");
        return;
      }

      startTransition(async () => {
        // Include the token in the submission
        const result = await sendEmailAction({ ...values, token });

        if (result.error) {
          toast.error("Error", {
            description: result.error,
          });
        } else {
          setSenderName(values.name);
          setShowSuccess(true);
          form.reset();
        }
      });
    } catch (error) {
      toast.error("An error occurred during verification");
      logger.error(error);
    }
  }

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
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem id="contact-name">
                  <FormLabel className="mb-2 block font-medium text-sm">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-card"
                      placeholder="John Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem id="contact-email">
                  <FormLabel className="mb-2 block font-medium text-sm">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-card"
                      placeholder="johndoe@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem id="contact-subject">
                <FormLabel className="mb-2 block font-medium text-sm">
                  Subject
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-card"
                    placeholder="Project Inquiry"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem id="contact-message">
                <FormLabel className="mb-2 block font-medium text-sm">
                  Message
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      className="bg-card"
                      placeholder="Hello! I want to give you a job..."
                      rows={8}
                      {...field}
                    />
                    <div className="mt-1 text-right text-muted-foreground text-xs">
                      {field.value?.length || 0} / 1000
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
