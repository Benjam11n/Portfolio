import type { MockButtonProps } from "@repo/testing/test-types";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmailAction } from "@/lib/actions/email.actions";
import { ContactForm } from "./contact-form";

const NAME_REGEX = /name/i;
const EMAIL_REGEX = /email/i;
const HELLO_REGEX = /Hello!/i;

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

vi.mock("@/lib/actions/email.actions", () => ({
  sendEmailAction: vi.fn(),
}));

vi.mock("@repo/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/components/shared/shift-submit-button", () => ({
  ShiftSubmitButton: ({
    children,
    onClick,
    type,
    isLoading,
  }: MockButtonProps) => (
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
    expect(screen.getByPlaceholderText(HELLO_REGEX)).toBeDefined();
    expect(screen.getByTestId("submit-button")).toBeDefined();
  });

  it("validates empty fields", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(sendEmailAction).not.toHaveBeenCalled();
    });
  });

  it("submits successfully with valid data", async () => {
    const user = userEvent.setup();
    vi.mocked(sendEmailAction).mockResolvedValue({
      success: true,
      data: { id: "mock-id" },
    });

    render(<ContactForm />);

    await user.type(screen.getByLabelText(NAME_REGEX), "John Doe");
    await user.type(screen.getByLabelText(EMAIL_REGEX), "john@example.com");
    await user.type(
      screen.getByPlaceholderText(HELLO_REGEX),
      "This is a test message with enough length."
    );

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(sendEmailAction).toHaveBeenCalledWith({
        email: "john@example.com",
        message: "This is a test message with enough length.",
        name: "John Doe",
        website: "",
      });
    });
  });

  it("handles server error properly", async () => {
    const user = userEvent.setup();
    vi.mocked(sendEmailAction).mockResolvedValue({
      error: "Server Error",
    });

    render(<ContactForm />);

    await user.type(screen.getByLabelText(NAME_REGEX), "John Doe");
    await user.type(screen.getByLabelText(EMAIL_REGEX), "john@example.com");
    await user.type(screen.getByPlaceholderText(HELLO_REGEX), "Test Message");

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Error",
        expect.objectContaining({ description: "Server Error" })
      );
    });
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(NAME_REGEX), "John Doe");
    await user.type(screen.getByLabelText(EMAIL_REGEX), "invalid-email");
    await user.type(screen.getByPlaceholderText(HELLO_REGEX), "Test Message");

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(sendEmailAction).not.toHaveBeenCalled();
    });
  });

  it("handles unexpected submission errors", async () => {
    const user = userEvent.setup();
    vi.mocked(sendEmailAction).mockRejectedValue(new Error("Unexpected"));

    render(<ContactForm />);

    await user.type(screen.getByLabelText(NAME_REGEX), "John Doe");
    await user.type(screen.getByLabelText(EMAIL_REGEX), "john@example.com");
    await user.type(screen.getByPlaceholderText(HELLO_REGEX), "Test Message");

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred");
    });
  });

  it("does not render reCAPTCHA copy", () => {
    render(<ContactForm />);
    expect(
      screen.queryByText(/This site is protected by reCAPTCHA/i)
    ).toBeNull();
  });

  it("includes an empty honeypot value in submission", async () => {
    const user = userEvent.setup();
    vi.mocked(sendEmailAction).mockResolvedValue({
      success: true,
      data: { id: "mock-id" },
    });

    render(<ContactForm />);

    await user.type(screen.getByLabelText(NAME_REGEX), "John Doe");
    await user.type(screen.getByLabelText(EMAIL_REGEX), "john@example.com");
    await user.type(
      screen.getByPlaceholderText(HELLO_REGEX),
      "This is a test message with enough length."
    );

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(sendEmailAction).toHaveBeenCalledWith(
        expect.objectContaining({ website: "" })
      );
    });
  });

  describe("Progress Indicator", () => {
    it("renders progress bar in message field", () => {
      render(<ContactForm />);
      const progress = screen.getByRole("progressbar");
      expect(progress).toBeDefined();
      expect(progress.getAttribute("aria-valuemax")).toBe("1000");
      expect(progress.getAttribute("aria-valuenow")).toBe("0");
    });

    it("displays character counter text initially as 0/1000", () => {
      render(<ContactForm />);
      expect(screen.getByText("0 / 1000")).toBeDefined();
    });

    it("updates progress and counter when typing in message field", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      const messageTextarea = screen.getByPlaceholderText(HELLO_REGEX);

      await user.type(messageTextarea, "a".repeat(50));

      const progress = screen.getByRole("progressbar");
      expect(progress.getAttribute("aria-valuenow")).toBe("50");
      expect(screen.getByText("50 / 1000")).toBeDefined();
    });

    it("shows green color for low character count", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      const messageTextarea = screen.getByPlaceholderText(HELLO_REGEX);

      await user.type(messageTextarea, "a".repeat(500));

      const progress = screen.getByRole("progressbar");
      const fill = progress.querySelector("div");
      expect(fill?.className).toContain("bg-primary");
    });

    it("shows yellow color for medium character count (70%+)", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      const messageTextarea = screen.getByPlaceholderText(HELLO_REGEX);

      await user.type(messageTextarea, "a".repeat(700));

      const progress = screen.getByRole("progressbar");
      const fill = progress.querySelector("div");
      expect(fill?.className).toContain("bg-yellow-500");
    });

    it("shows red color for high character count (90%+)", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      const messageTextarea = screen.getByPlaceholderText(HELLO_REGEX);

      await user.type(messageTextarea, "a".repeat(900));

      const progress = screen.getByRole("progressbar");
      const fill = progress.querySelector("div");
      expect(fill?.className).toContain("bg-destructive");
    });

    it("updates character count in real-time as user types", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      const messageTextarea = screen.getByPlaceholderText(HELLO_REGEX);

      expect(screen.getByText("0 / 1000")).toBeDefined();

      await user.clear(messageTextarea);
      await user.type(messageTextarea, "a".repeat(10));
      expect(screen.getByText("10 / 1000")).toBeDefined();

      await user.clear(messageTextarea);
      await user.type(messageTextarea, "a".repeat(100));
      expect(screen.getByText("100 / 1000")).toBeDefined();

      await user.clear(messageTextarea);
      await user.type(messageTextarea, "a".repeat(500));
      expect(screen.getByText("500 / 1000")).toBeDefined();
    });
  });
});
