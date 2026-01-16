/**
 * Sanitize reCAPTCHA verification data by extracting only safe fields for logging.
 * Removes sensitive information like tokens and challenge data.
 *
 * @param verifyData - The full reCAPTCHA verification response object
 * @returns A sanitized object containing only safe fields
 */
export function sanitizeRecaptchaData(
  verifyData: unknown
): Record<string, unknown> {
  // Handle null/undefined
  if (verifyData == null) {
    return {};
  }

  // Handle non-object types
  if (typeof verifyData !== "object" || Array.isArray(verifyData)) {
    return {};
  }

  // Safe fields to extract from reCAPTCHA response
  const safeFields = [
    "success",
    "challenge_ts",
    "hostname",
    "error-codes",
    "score",
    "action",
  ];

  const sanitized: Record<string, unknown> = {};

  for (const field of safeFields) {
    if (field in verifyData) {
      sanitized[field] = (verifyData as Record<string, unknown>)[field];
    }
  }

  return sanitized;
}
