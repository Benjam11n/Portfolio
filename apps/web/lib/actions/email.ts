"use server";

import { logger } from "@repo/logger";
import { secure } from "@repo/security";
import { env } from "@/env";
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
    await secure([]);
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
      to: [env.TO_EMAIL],
      subject: `Contact Request: ${subject}`,
      replyTo: email,
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      logger.error(error, "Resend API error:");
      return {
        error: "Failed to send email",
      };
    }

    return { success: true, data };
  } catch (error) {
    logger.error(error, "Server error:");
    return {
      error: "Internal server error",
    };
  }
}
