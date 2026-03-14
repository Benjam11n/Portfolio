import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(300, "Name must be at most 300 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(300, "Email must be at most 300 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be at most 1000 characters"),
  website: z.string(),
});

export const contactActionSchema = contactFormSchema;

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ContactActionValues = z.infer<typeof contactActionSchema>;
