"use server";

import { logger } from "@repo/logger";

import {
  generateContactEmailHtml,
  generateContactEmailText,
} from "@/lib/email/templates";
import { contactActionSchema } from "@/lib/validations/contact";
import type { ContactActionValues } from "@/lib/validations/contact";

const KNOWN_SECURITY_ERRORS = new Set([
  "Potential bot detected.",
  "You are sending too many requests. Please try again later.",
  "Suspicious activity detected.",
]);

export const sendEmailAction = async (formData: ContactActionValues) => {
  try {
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

    if (process.env.PLAYWRIGHT_TEST === "1") {
      return {
        data: { id: "playwright-contact-form" },
        success: true,
      };
    }

    const [{ secure }, { fromEmail, resend }, { serverEnv }] =
      await Promise.all([
        import("@repo/security"),
        import("@/lib/email/resend"),
        import("@/lib/env/server"),
      ]);

    await secure([]);

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

    if (error instanceof Error && KNOWN_SECURITY_ERRORS.has(error.message)) {
      return {
        error: error.message,
      };
    }

    return {
      error: "Internal server error",
    };
  }
};
