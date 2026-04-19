import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import { sendEmailAction } from "@/lib/actions/email.actions";
import {
  trackContactFormError,
  trackContactFormSuccess,
} from "@/lib/analytics/conversion";

import { useContactFormSubmit } from "./use-contact-form-submit";

const TEST_VALUES = {
  email: "john@example.com",
  message: "This message is definitely long enough.",
  name: "John Doe",
  website: "",
} as const;

const { mockLoggerError } = vi.hoisted(() => ({
  mockLoggerError: vi.fn(),
}));

vi.mock(import("@/lib/actions/email.actions"), () => ({
  sendEmailAction: vi.fn(),
}));

vi.mock(import("@/lib/analytics/conversion"), () => ({
  trackContactFormError: vi.fn(),
  trackContactFormSuccess: vi.fn(),
}));

vi.mock(import("@repo/logger"), () => ({
  logger: {
    error: mockLoggerError,
  },
}));

vi.mock(import("sonner"), () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe(useContactFormSubmit, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("tracks success and calls onSuccess for valid submissions", async () => {
    const onSuccess = vi.fn();
    vi.mocked(sendEmailAction).mockResolvedValue({
      data: { id: "email-id" },
      success: true,
    });

    const { result } = renderHook(() => useContactFormSubmit({ onSuccess }));

    act(() => {
      result.current.handleSubmit(TEST_VALUES);
    });

    await waitFor(() => {
      expect(trackContactFormSuccess).toHaveBeenCalledWith("main_form");
      expect(onSuccess).toHaveBeenCalledWith("John Doe");
    });

    expect(trackContactFormError).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("classifies known security failures as spam_blocked", async () => {
    vi.mocked(sendEmailAction).mockResolvedValue({
      error: "Potential bot detected.",
    });

    const { result } = renderHook(() => useContactFormSubmit());

    act(() => {
      result.current.handleSubmit(TEST_VALUES);
    });

    await waitFor(() => {
      expect(trackContactFormError).toHaveBeenCalledWith(
        "spam_blocked",
        "main_form"
      );
      expect(toast.error).toHaveBeenCalledWith("Error", {
        description: "Potential bot detected.",
      });
    });

    expect(trackContactFormSuccess).not.toHaveBeenCalled();
  });

  it("classifies other action failures as submission_failed", async () => {
    vi.mocked(sendEmailAction).mockResolvedValue({
      error: "Failed to send email",
    });

    const { result } = renderHook(() => useContactFormSubmit());

    act(() => {
      result.current.handleSubmit(TEST_VALUES);
    });

    await waitFor(() => {
      expect(trackContactFormError).toHaveBeenCalledWith(
        "submission_failed",
        "main_form"
      );
      expect(toast.error).toHaveBeenCalledWith("Error", {
        description: "Failed to send email",
      });
    });
  });

  it("tracks unexpected thrown failures separately", async () => {
    const error = new Error("Unexpected");
    vi.mocked(sendEmailAction).mockRejectedValue(error);

    const { result } = renderHook(() => useContactFormSubmit());

    act(() => {
      result.current.handleSubmit(TEST_VALUES);
    });

    await waitFor(() => {
      expect(trackContactFormError).toHaveBeenCalledWith(
        "unexpected_error",
        "main_form"
      );
      expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred");
      expect(mockLoggerError).toHaveBeenCalledWith(error);
    });

    expect(trackContactFormSuccess).not.toHaveBeenCalled();
  });
});
