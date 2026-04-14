"use server";

import { logger } from "@repo/logger";

import {
  generateContactEmailHtml,
  generateContactEmailText,
} from "@/lib/email/templates";
import { contactActionSchema } from "@/lib/validations/contact";
import type { ContactActionValues } from "@/lib/validations/contact";

export const sendEmailAction = async (formData: ContactActionValues) => {
  const isPlaywrightStubEnabled = process.env.PLAYWRIGHT_TEST === "1";

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

    if (isPlaywrightStubEnabled) {
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
