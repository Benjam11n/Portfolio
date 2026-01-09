import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmailAction } from "@/lib/actions/email.actions";
import { ContactForm } from "./contact-form";

// Mock dependencies
const NAME_REGEX = /name/i;
const EMAIL_REGEX = /email/i;
const SUBJECT_REGEX = /subject/i;
const HELLO_REGEX = /Hello!/i;

vi.mock("@/lib/actions/email.actions", () => ({
  sendEmailAction: vi.fn(),
}));

vi.mock("@/hooks/use-deferred-recaptcha", () => ({
  useDeferredRecaptcha: () => ({
    loadRecaptcha: vi.fn(),
    executeRecaptcha: vi.fn().mockResolvedValue("mock-token"),
    isRecaptchaReady: true,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock ShiftSubmitButton since it might use animation libs not friendly to jsdom
vi.mock("@/components/shared/shift-submit-button", () => ({
  ShiftSubmitButton: ({ children, onClick, type, isLoading }: any) => (
    <button
      data-testid="submit-button"
      disabled={isLoading}
      onClick={onClick}
      type={type}
    >
      {isLoading ? "Loading..." : children}
    </button>
  ),
}));

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(NAME_REGEX)).toBeDefined();
    expect(screen.getByLabelText(EMAIL_REGEX)).toBeDefined();
    expect(screen.getByLabelText(SUBJECT_REGEX)).toBeDefined();

    expect(screen.getByPlaceholderText(HELLO_REGEX)).toBeDefined();
    expect(screen.getByTestId("submit-button")).toBeDefined();
  });

  it("validates empty fields", async () => {
    render(<ContactForm />);
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.click(submitButton);

    await waitFor(() => {
      // Logic from Zod schema messages (assumed default or custom messages)
      // Usually "Required" or specific messages.
      // Checking for aria-invalid or similar is robust, but checking calls is easier for unit.
      expect(sendEmailAction).not.toHaveBeenCalled();
    });
  });

  it("submits successfully with valid data", async () => {
    // Setup successful mock response
    vi.mocked(sendEmailAction).mockResolvedValue({
      success: true,
      data: { id: "mock-id" },
    });

    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(NAME_REGEX), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(EMAIL_REGEX), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(SUBJECT_REGEX), {
      target: { value: "Test Subject" },
    });
    fireEvent.change(screen.getByPlaceholderText(HELLO_REGEX), {
      target: { value: "This is a test message with enough length." },
    });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(sendEmailAction).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        subject: "Test Subject",
        message: "This is a test message with enough length.",
        token: "mock-token",
      });
    });
  });

  it("handles server error properly", async () => {
    vi.mocked(sendEmailAction).mockResolvedValue({
      error: "Server Error",
    });

    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(NAME_REGEX), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(EMAIL_REGEX), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(SUBJECT_REGEX), {
      target: { value: "Test Subject" },
    });
    fireEvent.change(screen.getByPlaceholderText(HELLO_REGEX), {
      target: { value: "Test Message" },
    });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Error",
        expect.objectContaining({ description: "Server Error" })
      );
    });
  });
});
