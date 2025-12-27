"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
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
import { sendEmailAction } from "@/lib/actions/email";
import {
  type ContactFormValues,
  contactFormSchema,
} from "@/lib/validations/contact";
import { FormSuccessModal } from "./form-success-modal";

export const ContactForm = () => {
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);
  const [senderName, setSenderName] = useState("");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: ContactFormValues) {
    startTransition(async () => {
      const result = await sendEmailAction(values);

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
                <FormItem>
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
                <FormItem>
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
              <FormItem>
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
              <FormItem>
                <FormLabel className="mb-2 block font-medium text-sm">
                  Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-card"
                    placeholder="Hello! I want to give you a job..."
                    rows={8}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ShiftSubmitButton isLoading={isPending} type="submit">
            Submit
          </ShiftSubmitButton>
        </form>
      </Form>
    </>
  );
};
