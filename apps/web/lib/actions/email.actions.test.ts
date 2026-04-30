import { sendEmailAction } from "./email.actions";

const { mockLoggerError, mockResendSend, mockSecure } = vi.hoisted(() => ({
  mockLoggerError: vi.fn(),
  mockResendSend: vi.fn(),
  mockSecure: vi.fn(),
}));

vi.mock(import("@repo/security"), () => ({
  secure: mockSecure,
}));

vi.mock(import("@repo/logger"), () => ({
  logger: {
    error: mockLoggerError,
  },
}));

vi.mock(import("@/lib/email/resend"), () => ({
  fromEmail: "portfolio@example.com",
  resend: {
    emails: {
      send: mockResendSend,
    },
  },
}));

vi.mock(import("@/lib/env/server"), () => ({
  serverEnv: {
    TO_EMAIL: "owner@example.com",
  },
}));

describe(sendEmailAction, () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSecure.mockResolvedValue();
    delete process.env.PLAYWRIGHT_TEST;
  });

  it("sends email for valid submissions", async () => {
    mockResendSend.mockResolvedValue({
      data: { id: "email-id" },
      error: null,
    });

    const result = await sendEmailAction({
      email: "john@example.com",
      message: "This message is definitely long enough.",
      name: "John Doe",
      website: "",
    });

    expect(result).toStrictEqual({
      data: { id: "email-id" },
      success: true,
    });
    expect(mockSecure).toHaveBeenCalledWith([]);
    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "portfolio@example.com",
        replyTo: "john@example.com",
        subject: "Contact Request from Portfolio",
        to: ["owner@example.com"],
      })
    );
  });

  it("includes sender details and message content in the resend payload", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-30T00:00:00.000Z"));
    mockResendSend.mockResolvedValue({
      data: { id: "email-id" },
      error: null,
    });

    try {
      await sendEmailAction({
        email: "john@example.com",
        message: "Line one\nLine two",
        name: "John Doe",
        website: "",
      });

      expect(mockResendSend.mock.calls).toHaveLength(1);

      const payload = vi.mocked(mockResendSend).mock.calls[0]?.[0];

      expect(payload).toBeDefined();
      expect(payload?.html).toContain("John Doe");
      expect(payload?.html).toContain("mailto:john@example.com");
      expect(payload?.html).toContain("Line one<br />Line two");
      expect(payload?.html).toContain("Apr 30, 2026");
      expect(payload?.text).toContain("Name: John Doe");
      expect(payload?.text).toContain("Email: john@example.com");
      expect(payload?.text).toContain("Message:\nLine one\nLine two");
      expect(payload?.text).toContain("Apr 30, 2026");
    } finally {
      vi.useRealTimers();
    }
  });

  it("silently ignores honeypot submissions", async () => {
    const result = await sendEmailAction({
      email: "john@example.com",
      message: "This message is definitely long enough.",
      name: "John Doe",
      website: "https://spam.example.com",
    });

    expect(result).toStrictEqual({ success: true });
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("returns a friendly error for rate-limited requests", async () => {
    mockSecure.mockRejectedValue(
      new Error("You are sending too many requests. Please try again later.")
    );

    const result = await sendEmailAction({
      email: "john@example.com",
      message: "This message is definitely long enough.",
      name: "John Doe",
      website: "",
    });

    expect(result).toStrictEqual({
      error: "You are sending too many requests. Please try again later.",
    });
  });

  it("returns resend failures without throwing", async () => {
    mockResendSend.mockResolvedValue({
      data: null,
      error: { message: "Resend failed" },
    });

    const result = await sendEmailAction({
      email: "john@example.com",
      message: "This message is definitely long enough.",
      name: "John Doe",
      website: "",
    });

    expect(result).toStrictEqual({
      error: "Failed to send email",
    });
  });

  it("returns invalid form data for schema failures", async () => {
    const result = await sendEmailAction({
      email: "invalid-email",
      message: "short",
      name: "J",
      website: "",
    });

    expect(result.error).toBe("Invalid form data");
    expect(result.details).toBeDefined();
    expect(mockSecure).not.toHaveBeenCalled();
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("returns the Playwright stub payload without hitting resend", async () => {
    process.env.PLAYWRIGHT_TEST = "1";

    const result = await sendEmailAction({
      email: "john@example.com",
      message: "This message is definitely long enough.",
      name: "John Doe",
      website: "",
    });

    expect(result).toStrictEqual({
      data: { id: "playwright-contact-form" },
      success: true,
    });
    expect(mockSecure).not.toHaveBeenCalled();
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("returns internal server error for unexpected failures", async () => {
    mockSecure.mockRejectedValue(new Error("Unexpected failure"));

    const result = await sendEmailAction({
      email: "john@example.com",
      message: "This message is definitely long enough.",
      name: "John Doe",
      website: "",
    });

    expect(result).toStrictEqual({
      error: "Internal server error",
    });
  });
});
