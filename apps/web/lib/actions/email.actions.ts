"use server";

import { logger } from "@repo/logger";
import { secure } from "@repo/security";
import { env } from "@/lib/env";
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

    const { name, email, subject, message, token } = formData;

    if (!token) {
      return {
        error: "reCAPTCHA token is missing",
      };
    }

    // Verify reCAPTCHA token
    const verifyResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      logger.error(verifyData, "reCAPTCHA verification failed:");
      return {
        error: "reCAPTCHA verification failed",
      };
    }

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
