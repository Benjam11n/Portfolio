"use client";

import { logger } from "@repo/logger";
import { track } from "@vercel/analytics";

/**
 * Conversion event types for tracking user interactions
 */
export type ConversionEventType =
  | "contact_form_submit"
  | "contact_form_success"
  | "contact_form_error"
  | "cta_click"
  | "social_link_click"
  | "email_link_click"
  | "scroll_to_contact";

/**
 * Properties for conversion events
 */
export type ConversionEventProperties = {
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
export function trackConversion(properties: ConversionEventProperties): void {
  try {
    track(properties.event, {
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

/**
 * Track a CTA (Call-to-Action) click
 *
 * @param source - The source of the CTA
 * @example
 * ```tsx
 * trackCTAClick("floating_cta");
 * ```
 */
export function trackCTAClick(source: string): void {
  trackConversion({
    event: "cta_click",
    source,
    context: "navigation",
  });
}

/**
 * Track a social link click
 *
 * @param platform - The social platform (e.g., "github", "linkedin", "twitter")
 * @param source - The source of the link
 * @example
 * ```tsx
 * trackSocialLinkClick("github", "footer");
 * ```
 */
export function trackSocialLinkClick(platform: string, source?: string): void {
  trackConversion({
    event: "social_link_click",
    source: source ?? "unknown",
    context: "social_navigation",
    metadata: {
      platform,
    },
  });
}

/**
 * Track an email link click
 *
 * @param source - The source of the email link
 * @example
 * ```tsx
 * trackEmailLinkClick("contact_section");
 * ```
 */
export function trackEmailLinkClick(source: string): void {
  trackConversion({
    event: "email_link_click",
    source,
    context: "email_navigation",
  });
}

/**
 * Track scroll to contact section
 *
 * @param source - The source that triggered the scroll
 * @example
 * ```tsx
 * trackScrollToContact("navbar");
 * ```
 */
export function trackScrollToContact(source: string): void {
  trackConversion({
    event: "scroll_to_contact",
    source,
    context: "navigation",
  });
}
