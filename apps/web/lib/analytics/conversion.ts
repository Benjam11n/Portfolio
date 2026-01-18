"use client";

import { trackEvent } from "@repo/analytics";
import { logger } from "@repo/logger";

/**
 * Conversion event types for tracking user interactions
 */
type ConversionEventType =
  | "contact_form_submit"
  | "contact_form_success"
  | "contact_form_error"
  | "cta_click";

/**
 * Properties for conversion events
 */
type ConversionEventProperties = {
  /**
   * The type of conversion event
   */
  event: ConversionEventType;
  /**
   * Additional context about the event
   */
  context?: string;
  /**
   * The source of the conversion (e.g., "floating_cta", "navbar", "footer")
   */
  source?: string;
  /**
   * Any additional metadata
   */
  metadata?: Record<string, string | number | boolean>;
};

/**
 * Track a conversion event using Vercel Analytics
 *
 * @param properties - The event properties to track
 * @example
 * ```tsx
 * trackConversion({
 *   event: "contact_form_submit",
 *   source: "main_form",
 *   context: "homepage",
 * });
 * ```
 */
function trackConversion(properties: ConversionEventProperties): void {
  try {
    trackEvent(properties.event, {
      context: properties.context,
      source: properties.source,
      ...properties.metadata,
    });
  } catch (error) {
    // Silently fail to avoid disrupting user experience
    logger.error(error, "Failed to track conversion event:");
  }
}

/**
 * Track a successful contact form submission
 *
 * @param source - The source of the form submission
 * @example
 * ```tsx
 * trackContactFormSuccess("main_form");
 * ```
 */
export function trackContactFormSuccess(source?: string): void {
  trackConversion({
    event: "contact_form_success",
    source: source ?? "main_form",
    context: "form_submission",
  });
}

/**
 * Track a contact form error
 *
 * @param errorType - The type of error that occurred
 * @param source - The source of the form
 * @example
 * ```tsx
 * trackContactFormError("validation", "main_form");
 * ```
 */
export function trackContactFormError(
  errorType: string,
  source?: string
): void {
  trackConversion({
    event: "contact_form_error",
    source: source ?? "main_form",
    context: "form_error",
    metadata: {
      error_type: errorType,
    },
  });
}
