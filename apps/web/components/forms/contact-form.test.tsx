import type { MockButtonProps } from "@repo/testing/test-types";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { sendEmailAction } from "@/lib/actions/email.actions";

import { ContactForm } from "./contact-form";

vi.mock(import("canvas-confetti") as unknown as string, () => ({
  default: vi.fn(),
}));

vi.mock(import("@/lib/actions/email.actions") as unknown as string, () => ({
  sendEmailAction: vi.fn(),
}));

vi.mock(import("@repo/logger") as unknown as string, () => ({
  logger: {
    error: vi.fn(),
  },
}));

vi.mock(import("sonner") as unknown as string, () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock(
  import("@/components/shared/shift-submit-button") as unknown as string,
  () => ({
    ShiftSubmitButton: ({
      children,
      onClick,
      type = "submit",
      isLoading,
    }: MockButtonProps) => {
      if (type === "button") {
        return (
          <button
            data-testid="submit-button"
            disabled={isLoading}
            onClick={onClick}
            type="button"
          >
            {isLoading ? "Loading..." : children}
          </button>
        );
      }

      if (type === "reset") {
        return (
          <button
            data-testid="submit-button"
            disabled={isLoading}
            onClick={onClick}
            type="reset"
          >
            {isLoading ? "Loading..." : children}
          </button>
        );
      }

      return (
        <button
          data-testid="submit-button"
          disabled={isLoading}
          onClick={onClick}
          type="submit"
        >
          {isLoading ? "Loading..." : children}
        </button>
      );
    },
  })
);

describe(ContactForm, () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders the contact fields and submit button", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/hello!/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("shows validation errors and blocks submission for invalid input", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await expect(
      screen.findByText("Name must be at least 2 characters")
    ).resolves.toBeVisible();
    await expect(
      screen.findByText("Please enter a valid email address")
    ).resolves.toBeVisible();
    await expect(
      screen.findByText("Message must be at least 10 characters")
    ).resolves.toBeVisible();
    expect(sendEmailAction).not.toHaveBeenCalled();
  });

  it("submits valid data, resets fields, and shows a success toast", async () => {
    const user = userEvent.setup();
    vi.mocked(sendEmailAction).mockResolvedValue({
      data: { id: "mock-id" },
      success: true,
    });

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByPlaceholderText(/hello!/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(messageInput, "This is a test message with enough length.");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(sendEmailAction).toHaveBeenCalledWith({
        email: "john@example.com",
        message: "This is a test message with enough length.",
        name: "John Doe",
        website: "",
      });
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Thanks John Doe!", {
        description: "Your message has been sent successfully.",
      });
      expect(nameInput).toHaveValue("");
      expect(emailInput).toHaveValue("");
      expect(messageInput).toHaveValue("");
    });
  });

  it("disables the submit button while a submission is pending", async () => {
    const user = userEvent.setup();
    let resolveSubmission: ((value: { success: true }) => void) | undefined;

    vi.mocked(sendEmailAction).mockImplementation(
      () =>
        // eslint-disable-next-line promise/avoid-new -- test needs externally resolved pending Promise.
        new Promise<{ success: true }>((resolve) => {
          resolveSubmission = resolve;
        })
    );

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(
      screen.getByPlaceholderText(/hello!/i),
      "Long enough message"
    );
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByTestId("submit-button")).toBeDisabled();
      expect(screen.getByTestId("submit-button")).toHaveTextContent(
        "Loading..."
      );
    });

    resolveSubmission?.({ success: true });

    await waitFor(() => {
      expect(screen.getByTestId("submit-button")).not.toBeDisabled();
    });
  });

  it("shows the returned server error message", async () => {
    const user = userEvent.setup();
    vi.mocked(sendEmailAction).mockResolvedValue({
      error: "Server Error",
    });

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByPlaceholderText(/hello!/i), "Test Message");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error", {
        description: "Server Error",
      });
    });
  });

  it("shows a generic error toast when submission throws", async () => {
    const user = userEvent.setup();
    vi.mocked(sendEmailAction).mockRejectedValue(new Error("Unexpected"));

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByPlaceholderText(/hello!/i), "Test Message");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred");
    });
  });

  it("submits an empty honeypot value with valid user input", async () => {
    const user = userEvent.setup();
    vi.mocked(sendEmailAction).mockResolvedValue({
      data: { id: "mock-id" },
      success: true,
    });

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(
      screen.getByPlaceholderText(/hello!/i),
      "This is a test message with enough length."
    );
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(sendEmailAction).toHaveBeenCalledWith(
        expect.objectContaining({ website: "" })
      );
    });
  });

  it("updates the message counter and progress bar as the user types", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const messageInput = screen.getByPlaceholderText(/hello!/i);
    const progress = screen.getByRole("progressbar");

    expect(progress).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByText("0 / 1000")).toBeInTheDocument();

    await user.type(messageInput, "Hello there");

    expect(progress).toHaveAttribute("aria-valuenow", "11");
    expect(screen.getByText("11 / 1000")).toBeInTheDocument();
  });
});
