"use server";

import { logger } from "@repo/logger";
import { secure } from "@repo/security";

import { fromEmail, resend } from "@/lib/email/resend";
import {
  generateContactEmailHtml,
  generateContactEmailText,
} from "@/lib/email/templates";
import { serverEnv } from "@/lib/env/server";
import { contactActionSchema } from "@/lib/validations/contact";
import type { ContactActionValues } from "@/lib/validations/contact";

export const sendEmailAction = async (formData: ContactActionValues) => {
  try {
    await secure([]);
    const result = contactActionSchema.safeParse(formData);
    if (!result.success) {
      return {
        details: result.error.format(),
        error: "Invalid form data",
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
      html: htmlContent,
      replyTo: email,
      subject: "Contact Request from Portfolio",
      text: textContent,
      to: [serverEnv.TO_EMAIL],
    });

    if (error) {
      logger.error(error, "Resend API error:");
      return {
        error: "Failed to send email",
      };
    }

    return { data, success: true };
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
};
