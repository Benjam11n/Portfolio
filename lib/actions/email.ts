"use server";

import { fromEmail, resend } from "@/lib/email/resend";
import {
  generateContactEmailHtml,
  generateContactEmailText,
} from "@/lib/email/templates";
import {
  type ContactFormValues,
  contactFormSchema,
} from "@/lib/validations/contact";

export async function sendEmailAction(formData: ContactFormValues) {
  try {
    const result = contactFormSchema.safeParse(formData);
    if (!result.success) {
      return {
        error: "Invalid form data",
        details: result.error.format(),
      };
    }

    const { name, email, subject, message } = formData;

    const htmlContent = generateContactEmailHtml(name, email, subject, message);
    const textContent = generateContactEmailText(name, email, subject, message);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [process.env.TO_EMAIL ?? "ben.wang9000@example.com"],
      subject: `Contact Request: ${subject}`,
      replyTo: email,
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend API error:", error);
      return {
        error: "Failed to send email",
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Server error:", error);
    return {
      error: "Internal server error",
    };
  }
}
