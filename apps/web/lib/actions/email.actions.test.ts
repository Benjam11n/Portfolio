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
});
