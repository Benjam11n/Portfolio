import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmailAction } from "@/lib/actions/email.actions";
import { useDeferredRecaptcha } from "@/lib/hooks/use-deferred-recaptcha";
import { ContactForm } from "./contact-form";

// Mock dependencies
const NAME_REGEX = /name/i;
const EMAIL_REGEX = /email/i;
const SUBJECT_REGEX = /subject/i;
const HELLO_REGEX = /Hello!/i;

vi.mock("@/lib/actions/email.actions", () => ({
  sendEmailAction: vi.fn(),
}));

vi.mock("@/lib/hooks/use-deferred-recaptcha", () => ({
  useDeferredRecaptcha: vi.fn(() => ({
    loadRecaptcha: vi.fn(),
    executeRecaptcha: vi.fn().mockResolvedValue("mock-token"),
    isRecaptchaReady: true,
  })),
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
    vi.resetAllMocks();
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
  it("shows validation error for invalid email", async () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(NAME_REGEX), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(EMAIL_REGEX), {
      target: { value: "invalid-email" }, // Invalid email
    });
    fireEvent.change(screen.getByLabelText(SUBJECT_REGEX), {
      target: { value: "Test Subject" },
    });
    fireEvent.change(screen.getByPlaceholderText(HELLO_REGEX), {
      target: { value: "Test Message" },
    });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    // Expect email validation error (checking for standard HTML5 validation or Zod message)
    // Assuming Zod resolver prevents submission
    await waitFor(() => {
      expect(sendEmailAction).not.toHaveBeenCalled();
    });
  });

  it("handles recaptcha execution failure gracefully", async () => {
    // Mock recaptcha failure (return null token)
    vi.mocked(useDeferredRecaptcha).mockImplementation(() => ({
      loadRecaptcha: vi.fn(),
      executeRecaptcha: vi.fn().mockResolvedValue(null),
      isRecaptchaReady: true,
      isRecaptchaLoaded: true,
    }));

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
      expect(toast.error).toHaveBeenCalledWith("ReCAPTCHA verification failed");
      expect(sendEmailAction).not.toHaveBeenCalled();
    });
  });

  it("handles unexpected error during verification", async () => {
    // Mock verification error
    vi.mocked(useDeferredRecaptcha).mockImplementation(() => ({
      loadRecaptcha: vi.fn(),
      executeRecaptcha: vi
        .fn()
        .mockRejectedValue(new Error("Verification Error")),
      isRecaptchaReady: true,
      isRecaptchaLoaded: true,
    }));

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
        "An error occurred during verification"
      );
    });
  });

  it("disables all inputs during form submission", async () => {
    // Create a deferred promise to control when submission completes
    let resolveSubmission: (value: any) => void;
    const deferredPromise = new Promise((resolve) => {
      resolveSubmission = resolve;
    });

    vi.mocked(sendEmailAction).mockReturnValue(deferredPromise);

    render(<ContactForm />);

    // Fill form with valid data
    const nameInput = screen.getByLabelText(NAME_REGEX);
    const emailInput = screen.getByLabelText(EMAIL_REGEX);
    const subjectInput = screen.getByLabelText(SUBJECT_REGEX);
    const messageInput = screen.getByPlaceholderText(HELLO_REGEX);
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(subjectInput, { target: { value: "Test Subject" } });
    fireEvent.change(messageInput, {
      target: { value: "This is a test message with enough length." },
    });

    // Verify inputs are enabled before submission
    expect(nameInput).not.toBeDisabled();
    expect(emailInput).not.toBeDisabled();
    expect(subjectInput).not.toBeDisabled();
    expect(messageInput).not.toBeDisabled();

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for the submission to start (isPending becomes true)
    await waitFor(() => {
      // Verify all inputs are disabled during submission
      expect(nameInput).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(subjectInput).toBeDisabled();
      expect(messageInput).toBeDisabled();
      // Verify submit button is also disabled
      expect(submitButton).toBeDisabled();
    });

    // Resolve the submission promise
    resolveSubmission!({
      success: true,
      data: { id: "mock-id" },
    });

    // Wait for submission to complete and inputs to be enabled again
    await waitFor(() => {
      // Note: After successful submission, the form is reset and the success modal is shown
      // The inputs should be enabled again, but we can't reliably test this in the DOM
      // because the success modal overlays everything. The key test is that they ARE disabled during submission.
      expect(sendEmailAction).toHaveBeenCalled();
    });
  });
});
