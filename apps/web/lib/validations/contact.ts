import { z } from "zod";

const contactSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(300, "Email must be at most 300 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be at most 1000 characters"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(300, "Name must be at most 300 characters"),
  website: z.string(),
});

export const contactFormSchema = contactSchema;
export const contactActionSchema = contactSchema;

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ContactActionValues = z.infer<typeof contactActionSchema>;
