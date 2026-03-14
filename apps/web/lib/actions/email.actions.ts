"use server";

import { logger } from "@repo/logger";
import { secure } from "@repo/security";
import { fromEmail, resend } from "@/lib/email/resend";
import {
  generateContactEmailHtml,
  generateContactEmailText,
} from "@/lib/email/templates";
import { env } from "@/lib/env";
import {
  type ContactActionValues,
  contactActionSchema,
} from "@/lib/validations/contact";

export async function sendEmailAction(formData: ContactActionValues) {
  try {
    await secure([]);
    const result = contactActionSchema.safeParse(formData);
    if (!result.success) {
      return {
        error: "Invalid form data",
        details: result.error.format(),
      };
    }

    const { name, email, message, website } = result.data;

    if (website.trim()) {
      return { success: true };
    }

    const htmlContent = generateContactEmailHtml(name, email, message);
    const textContent = generateContactEmailText(name, email, message);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [env.TO_EMAIL],
      subject: "Contact Request from Portfolio",
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

    if (error instanceof Error) {
      const knownSecurityErrors = new Set([
        "Potential bot detected.",
        "You are sending too many requests. Please try again later.",
        "Suspicious activity detected.",
      ]);

      if (knownSecurityErrors.has(error.message)) {
        return {
          error: error.message,
        };
      }
    }

    return {
      error: "Internal server error",
    };
  }
}
