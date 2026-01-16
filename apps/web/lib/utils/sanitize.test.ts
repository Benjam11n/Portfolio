import { describe, expect, it } from "vitest";
import { sanitizeRecaptchaData } from "./sanitize";

describe("sanitizeRecaptchaData", () => {
  describe("edge cases", () => {
    it("should return empty object for null input", () => {
      const result = sanitizeRecaptchaData(null);
      expect(result).toEqual({});
    });

    it("should return empty object for undefined input", () => {
      const result = sanitizeRecaptchaData(undefined);
      expect(result).toEqual({});
    });

    it("should return empty object for string input", () => {
      const result = sanitizeRecaptchaData("string");
      expect(result).toEqual({});
    });

    it("should return empty object for number input", () => {
      const result = sanitizeRecaptchaData(123);
      expect(result).toEqual({});
    });

    it("should return empty object for boolean input", () => {
      const result = sanitizeRecaptchaData(true);
      expect(result).toEqual({});
    });

    it("should return empty object for array input", () => {
      const result = sanitizeRecaptchaData([1, 2, 3]);
      expect(result).toEqual({});
    });

    it("should return empty object for empty object", () => {
      const result = sanitizeRecaptchaData({});
      expect(result).toEqual({});
    });
  });

  describe("safe fields extraction", () => {
    it("should extract success field", () => {
      const result = sanitizeRecaptchaData({ success: true });
      expect(result).toEqual({ success: true });
    });

    it("should extract challenge_ts field", () => {
      const timestamp = "2024-01-15T10:30:00Z";
      const result = sanitizeRecaptchaData({ challenge_ts: timestamp });
      expect(result).toEqual({ challenge_ts: timestamp });
    });

    it("should extract hostname field", () => {
      const hostname = "example.com";
      const result = sanitizeRecaptchaData({ hostname });
      expect(result).toEqual({ hostname });
    });

    it("should extract error-codes field", () => {
      const errorCodes = ["invalid-input-secret", "bad-request"];
      const result = sanitizeRecaptchaData({ "error-codes": errorCodes });
      expect(result).toEqual({ "error-codes": errorCodes });
    });

    it("should extract all safe fields", () => {
      const input = {
        success: true,
        challenge_ts: "2024-01-15T10:30:00Z",
        hostname: "example.com",
        "error-codes": [],
      };
      const result = sanitizeRecaptchaData(input);
      expect(result).toEqual(input);
    });
  });

  describe("sensitive fields filtering", () => {
    it("should filter out token field", () => {
      const result = sanitizeRecaptchaData({
        token: "sensitive-token-data",
        success: true,
      });
      expect(result).toEqual({ success: true });
      expect(result).not.toHaveProperty("token");
    });

    it("should extract score and action fields", () => {
      const result = sanitizeRecaptchaData({
        token: "sensitive-token",
        action: "submit",
        score: 0.9,
        success: true,
        hostname: "example.com",
      });
      expect(result).toEqual({
        success: true,
        hostname: "example.com",
        action: "submit",
        score: 0.9,
      });
      expect(result).not.toHaveProperty("token");
    });
  });

  describe("realistic reCAPTCHA responses", () => {
    it("should sanitize successful reCAPTCHA response", () => {
      const verifyData = {
        success: true,
        challenge_ts: "2024-01-15T10:30:00Z",
        hostname: "example.com",
        score: 0.9,
        action: "submit",
        token: "03AGdBq26S...abc123",
      };
      const result = sanitizeRecaptchaData(verifyData);
      expect(result).toEqual({
        success: true,
        challenge_ts: "2024-01-15T10:30:00Z",
        hostname: "example.com",
        score: 0.9,
        action: "submit",
      });
    });

    it("should sanitize failed reCAPTCHA response with error codes", () => {
      const verifyData = {
        success: false,
        "error-codes": ["invalid-input-secret", "bad-request"],
        challenge_ts: "2024-01-15T10:30:00Z",
        hostname: "example.com",
        token: "03AGdBq26S...abc123",
      };
      const result = sanitizeRecaptchaData(verifyData);
      expect(result).toEqual({
        success: false,
        "error-codes": ["invalid-input-secret", "bad-request"],
        challenge_ts: "2024-01-15T10:30:00Z",
        hostname: "example.com",
      });
    });

    it("should handle reCAPTCHA response with partial fields", () => {
      const verifyData = {
        success: false,
        "error-codes": ["timeout-or-duplicate"],
        token: "sensitive-token",
      };
      const result = sanitizeRecaptchaData(verifyData);
      expect(result).toEqual({
        success: false,
        "error-codes": ["timeout-or-duplicate"],
      });
    });
  });

  describe("type safety", () => {
    it("should return object with correct type", () => {
      const result = sanitizeRecaptchaData({ success: true });
      expect(typeof result).toBe("object");
      expect(Array.isArray(result)).toBe(false);
    });

    it("should preserve types of safe fields", () => {
      const result = sanitizeRecaptchaData({
        success: false,
        challenge_ts: "2024-01-15T10:30:00Z",
        hostname: "example.com",
        "error-codes": ["error-1", "error-2"],
        score: 0.9,
        action: "submit",
      });
      expect(typeof result.success).toBe("boolean");
      expect(typeof result.challenge_ts).toBe("string");
      expect(typeof result.hostname).toBe("string");
      expect(Array.isArray(result["error-codes"])).toBe(true);
      expect(typeof result.score).toBe("number");
      expect(typeof result.action).toBe("string");
    });
  });
});
